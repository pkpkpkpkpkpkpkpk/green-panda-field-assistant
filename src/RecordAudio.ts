import { formatStringToTable } from './FormatStringToTable';

const recordAudio = () => {
  const startRecordingBtn = document.querySelector('[data-start-recording]');
  const stopRecordingBtn = document.querySelector('[data-stop-recording]');
  const outputTable = document.querySelector('[data-output-table]');

  let mediaRecorder:MediaRecorder;
  let chunks:Blob[] = [];

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        startRecordingBtn?.addEventListener('click', (e:MouseEvent) => startRecording(e));
        stopRecordingBtn?.addEventListener('click', (e:MouseEvent) => stopRecording(e));

        // document.body.onkeyup = e => {
        //   if(e.key == " " || e.code == "Space" || e.keyCode == 32) {
            
        //   }
        // }

        mediaRecorder.onstop = () => onRecordingStop();
      })
  
      .catch(err => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log('getUserMedia not supported on your browser!');
  };

  const startRecording = (e:MouseEvent) => {
    e.preventDefault();
    mediaRecorder.start();
    document.body.classList.add('is-recording');

    const self = e.currentTarget as HTMLButtonElement;
    self.setAttribute('disabled', '');
    self.classList.add('is-disabled');
  
    stopRecordingBtn.removeAttribute('disabled');
    stopRecordingBtn.classList.remove('is-disabled');
  
    outputTable.classList.remove('is-docs');
    while (outputTable.firstChild) outputTable.removeChild(outputTable.firstChild);
  };
  
  const stopRecording = (e:MouseEvent) => {
    e.preventDefault();
    mediaRecorder.stop();
    document.body.classList.remove('is-recording');

    const self = e.currentTarget as HTMLButtonElement;
    self.setAttribute('disabled', '');
    self.classList.add('is-disabled');
  
    startRecordingBtn.classList.remove('is-recording');
    startRecordingBtn.removeAttribute('disabled');
    startRecordingBtn.classList.remove('is-disabled');
  };

  const onRecordingStop = () => {
    const audio = document.createElement('audio');
    const blob = new Blob(chunks, { type: 'audio/wav;codecs=0' });
    chunks = [];
    const blobURL = window.URL.createObjectURL(blob);
    audio.src = blobURL;

    fetch('http://localhost:3000/dictation', {
      method: 'POST',
      body: blob,
    })
    .then(res => res.text())
    .then(text => formatStringToTable(text));
  };
};

document.addEventListener('DOMContentLoaded', () => recordAudio());
