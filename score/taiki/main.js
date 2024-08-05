
var bpm =83;//**bpm */
var four_measure = 11;//**４拍子の小節数 */
var three_measure = 5;//**３拍子の小節数 */
let spare =3;//**予備小節数 */
const buttonStart = document.querySelector('#buttonStart')
const buttonStop = document.querySelector('#buttonStop')
const buttonReset = document.querySelector('#buttonReset')
const videoLive = document.querySelector('#videoLive')
const videoRecorded = document.querySelector('#videoRecorded')
const table = document.getElementById('table').rows[0];
var videodata;
    table.width='100%';
    for(l=0;l<3;l++){
      table.cells[l].width= '333px';
    }
    buttonReset.style.display='none'
    buttonStop.style.display='none'

async function main () {
  
    const stream = await navigator.mediaDevices.getUserMedia({ // <1>
      video: true,
      audio: true,
    })
  
    videoLive.srcObject = stream
  
    if (!MediaRecorder.isTypeSupported('video/webm')) { // <2>
      console.warn('video/webm is not supported')
    }
  
    const mediaRecorder = new MediaRecorder(stream, { // <3>
      mimeType: 'video/webm',
    })
  
    buttonStart.addEventListener('click', () => {
      mediaRecorder.start() // <4>
      Count();
      buttonStart.style.display='none';
      buttonStart.setAttribute('disabled', '')
      buttonStop.removeAttribute('disabled')
      buttonStop.style.display='block';
    })
  
    buttonStop.addEventListener('click', () => {
      mediaRecorder.stop() // <5>
      videoLive.style.display='none';
      videoRecorded.style.display='block';
      buttonReset.style.display='block';
      buttonStop.style.display='none';
      buttonStart.removeAttribute('disabled')
      buttonStop.setAttribute('disabled', '')
      document.getElementById('downroadbutton').style.display='block';
    })
  
    mediaRecorder.addEventListener('dataavailable', event => {
        videodata = event.data;
      videoRecorded.src = URL.createObjectURL(event.data) // <6>
    })
  }

  function downroad(){
    const url = window.URL.createObjectURL(videodata);
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
  }



  function Count(){
    var ms = 60000/bpm;
    var text = document.getElementById('text');
    let i=0;
    table.insertCell(1);
    table.width='100%';
    text.innerText = `予備${spare}小節`;
    for(l=0;l<4;l++){
      table.cells[l].width= '250px';
    }
    const timer1 = setInterval(function() {//**予備小節 */

        
            table.cells[i].style.backgroundColor = "yellow";
            if(i>0){
            let j = i-1;
            table.cells[j].style.backgroundColor = "white";
            }
            if(i==0){
                table.cells[3].style.backgroundColor = "white";
            }
        i=i+1;
        if(i>3){
            i=0;
            spare--;
        }
        if (spare == 1) {
            setTimeout(function(){text.innerText = '次の小節から演奏'},ms);
          }

        
      
        if (spare <= 0) {
          clearInterval(timer1);
          setTimeout(function(){text.innerText = '演奏開始'},ms);
          const timer2 = setInterval(function() {//**四拍子 */

            
            table.cells[i].style.backgroundColor = "yellow";
            if(i>0){
            let j = i-1;
            table.cells[j].style.backgroundColor = "white";
            }
            if(i==0){
                table.cells[3].style.backgroundColor = "white";
            }
            i=i+1;
            if(i>3){
                i=0;
                four_measure--;
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
                
                table.cells[i].style.backgroundColor = "yellow";
                if(i>0){
                let j = i-1;
                table.cells[j].style.backgroundColor = "white";
                }
                if(i==0){
                    table.cells[2].style.backgroundColor = "white";
                }
                i=i+1;
                if(i>2){
                    i=0;
                    three_measure--;
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