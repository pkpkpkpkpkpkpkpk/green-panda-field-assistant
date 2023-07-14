import { formatStringToTable } from './FormatStringToTable';

document.addEventListener('DOMContentLoaded', () => {
  const startRecording = document.querySelector('[data-start-recording]');
  const stopRecording = document.querySelector('[data-stop-recording]');
  const outputTable = document.querySelector('[data-output-table]');
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // console.log('getUserMedia supported.');
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        { audio: true, }
      )
  
      // Success callback
      .then((stream) => {
        // console.log('Success!');

        // var options = {
        //   audioBitsPerSecond : 128000,
        //   mimeType : 'audio/webm;codecs=pcm',
        // }

        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        startRecording?.addEventListener('click', e => {
          e.preventDefault();
          mediaRecorder.start();
          // console.log(mediaRecorder.state);
          // console.log('recorder started');
          const self = e.currentTarget;
          self.classList.add('is-recording');
          self.setAttribute('disabled', true);
          self.classList.add('is-disabled');

          stopRecording.removeAttribute('disabled');
          stopRecording.classList.remove('is-disabled');

          while (outputTable.firstChild) outputTable.removeChild(outputTable.firstChild);
        });

        stopRecording?.addEventListener('click', e => {
          e.preventDefault();
          mediaRecorder.stop();
          // console.log(mediaRecorder.state);
          // console.log('recorder stopped');
          const self = e.currentTarget;
          self.setAttribute('disabled', true);
          self.classList.add('is-disabled');

          startRecording.classList.remove('is-recording');
          startRecording.removeAttribute('disabled');
          startRecording.classList.remove('is-disabled');
        });

        mediaRecorder.onstop = (e) => {
          const audio = document.createElement('audio');
          // audio.setAttribute('controls', '');
          // outputTable.appendChild(audio);
        
          const blob = new Blob(chunks, { type: 'audio/wav;codecs=0' });
          chunks = [];
          const blobURL = window.URL.createObjectURL(blob);
          audio.src = blobURL;

          fetch('http://localhost:3000/dictation', {
            method: 'POST',
            body: blob,
          })
          .then((res) => res.text())
          .then((text) => {
            console.log(text)

            formatStringToTable(text);
          });
        }
      })
  
      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
});


