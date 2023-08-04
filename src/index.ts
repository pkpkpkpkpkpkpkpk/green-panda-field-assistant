import './styles/style.scss';
import generateDomElements from './scripts/GenerateDomElements';
import attachRecordingEvents from './scripts/AttachRecordingEvents';
import * as recorder from './scripts/WavEncoderRecorder';
import transcriber from './scripts/Transcriber';
import formatTextToTable from './scripts/FormatTextToTable';
// import copyTableToClipboard from './scripts/CopyTableToClipboard';

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
