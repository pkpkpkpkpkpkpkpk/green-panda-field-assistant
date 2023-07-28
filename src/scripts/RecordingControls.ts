import { initRecorder, startRecorder, stopRecorder, exportWavBlob } from './WavEncoderRecorder';
import { transcribe } from './Transcribe';

let startRecordingBtn:HTMLButtonElement;
let stopRecordingBtn:HTMLButtonElement;
let outputTable:HTMLTableElement;

export const recordingControls = async() => {
  startRecordingBtn = document.querySelector('[data-start-recording]');
  stopRecordingBtn = document.querySelector('[data-stop-recording]');
  outputTable = document.querySelector('[data-output-table]');

  initRecorder();

  startRecordingBtn?.addEventListener('click', (e:MouseEvent) => startRecording(e));
  stopRecordingBtn?.addEventListener('click', (e:MouseEvent) => stopRecording(e));

  // document.body.onkeyup = e => {
  //   if(e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
      
  //   }
  // }
};

const startRecording = (e:MouseEvent) => {
  e.preventDefault();
  startRecorder();

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
  stopRecorder();
  const wavBlob = exportWavBlob();
  transcribe(wavBlob);

  document.body.classList.remove('is-recording');

  const self = e.currentTarget as HTMLButtonElement;
  self.setAttribute('disabled', '');
  self.classList.add('is-disabled');

  startRecordingBtn.classList.remove('is-recording');
  startRecordingBtn.removeAttribute('disabled');
  startRecordingBtn.classList.remove('is-disabled');
};
