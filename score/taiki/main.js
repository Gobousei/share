
var bpm =83;//**bpm */
var four_measure = 8;//**４拍子の小節数 */
var three_measure = 4;//**３拍子の小節数 */
let spare =3;//**予備小節数 */
const buttonStart = document.querySelector('#buttonStart')
const buttonStop = document.querySelector('#buttonStop')
const buttonReset = document.querySelector('#buttonReset')
const videoLive = document.querySelector('#videoLive')
const videoRecorded = document.querySelector('#videoRecorded')
const table = document.querySelector('#table').rows[0];
const downloadbutton = document.querySelector('#downroadbutton')
const text = document.querySelector('#text')
var videodata;
table.width='100%';
buttonReset.style.display='none'
buttonStop.style.display='none'
for(l=0;l<3;l++){
  table.cells[l].width= '333px';
  }

async function main () {//**カメラの起動を含む常時起動関数 */
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true,
      audio: true,
    })
    videoLive.srcObject = stream
    if (!MediaRecorder.isTypeSupported('video/webm')) {
      console.warn('video/webm is not supported')
    }
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    })
  
    buttonStart.addEventListener('click', () => {//**収録スタート */
      mediaRecorder.start();
      Count();
      buttonStart.style.display='none';
      buttonStop.style.display='block';
      buttonStart.setAttribute('disabled', '')
      buttonStop.removeAttribute('disabled')
    })
  
    buttonStop.addEventListener('click', () => {//**収録ストップ */
      mediaRecorder.stop();
      videoLive.style.display='none';
      buttonStop.style.display='none';
      videoRecorded.style.display='inline-block';
      buttonReset.style.display='inline-block';
      downroadbutton.style.display='inline-block';
      buttonStart.removeAttribute('disabled')
      buttonStop.setAttribute('disabled', '')
    })
  
    mediaRecorder.addEventListener('dataavailable', event => {//**再生 */
        videodata = event.data;
      videoRecorded.src = URL.createObjectURL(event.data);
    })

    downroadbutton.addEventListener('click',() => {//**動画のダウンロード */
      var url = window.URL.createObjectURL(videodata);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "rec.webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    })
  }





  function Count(){//**メトロノーム */
    var ms = 60000/bpm;
    let i= -1;
    table.insertCell(1);
    table.width='100%';
    text.innerText = `予備${spare}小節`;
    for(l=0;l<4;l++){
      table.cells[l].width= '250px';
    }
    const timer1 = setInterval(function() {//**予備小節 */
      i++;
      table.cells[i].style.backgroundColor = "yellow";
      if(i!=0){
        let h = i-1;
        table.cells[h].style.backgroundColor = "white";
      }
      switch (true){
        case i==0:
        table.cells[3].style.backgroundColor = "white";
        break;

        case i==3:
          i=-1;
          spare--;
        break;
      }
      if (spare == 1) {
        setTimeout(function(){text.innerText = '次の小節から演奏'},ms);
      }
      if (spare <= 0) {
        clearInterval(timer1);
        setTimeout(function(){text.innerText = '演奏開始'},ms);


          const timer2 = setInterval(function() {//**四拍子 */  
            i++;
            table.cells[i].style.backgroundColor = "yellow";
            if(i!=0){
            let h = i-1;
            table.cells[h].style.backgroundColor = "white";
            }
            switch (true){
              case i==0:
                table.cells[3].style.backgroundColor = "white";
              break;

              case i==3:
                i=-1;
                four_measure--;
              break;
            }
            if(four_measure==1){
              setTimeout(function(){text.innerText = '次の小節から３拍子'},ms);
            }
            if (four_measure <= 0) {
              clearInterval(timer2);
              setTimeout(function(){
                text.innerText = '３拍子';
                table.deleteCell(-1);
                table.width='100%';
                for(l=0;l<2;l++){
                  table.cells[l].width= '333px';
                }
              },ms);
              

              const timer3 = setInterval(function() {//**三拍子 */
                i++;
                table.cells[i].style.backgroundColor = "yellow";
                if(i!=0){
                  let h = i-1;
                  table.cells[h].style.backgroundColor = "white";
                }
                switch (true){
                  case i==0:
                    table.cells[2].style.backgroundColor = "white";
                  break;

                  case i==2:
                    i=-1;
                    three_measure--;
                  break;
                }
                if (three_measure <= 0) {
                  clearInterval(timer3);
                  setTimeout(function(){text.innerText = '演奏終了'},ms);
                }
              }, ms);


            }
          }, ms);


        }
      }, ms);
    
}
main()