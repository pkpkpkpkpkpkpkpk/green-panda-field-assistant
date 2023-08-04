import generateDomElements from './GenerateDomElements';
import attachRecordingEvents from './AttachRecordingEvents';
import * as recorder from './WavEncoderRecorder';
import transcriber from './Transcriber';
import formatTextToTable from './FormatTextToTable';
// import copyTableToClipboard from './CopyTableToClipboard';

const onDOMContentLoaded = () => {
  attachRecordingEvents();
  recorder.init();
  // copyTableToClipboard();
}

const onRecordingStarted = () => {
  recorder.start();
  document.body.classList.add('is-recording');
  formatTextToTable('');
}

const onRecordingStopped = async() => {
  recorder.stop();
  document.body.classList.remove('is-recording');
  const wavBlob = recorder.exportWavBlob();
  const transcribedText = await transcriber(wavBlob);
  formatTextToTable(transcribedText);
}

document.body.appendChild(generateDomElements());
document.addEventListener('DOMContentLoaded', () => onDOMContentLoaded());
document.addEventListener('onRecordingStarted', () => onRecordingStarted());
document.addEventListener('onRecordingStopped', () => onRecordingStopped());
