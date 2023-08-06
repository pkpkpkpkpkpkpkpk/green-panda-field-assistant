import generateDomElements from './GenerateDomElements';
import * as recorder from './WavEncoderRecorder';
import * as events from './Events';
import * as helpers from './tools/Helpers';
import transcriber from './Transcriber';
import formatTextToTable from './FormatTextToTable';

let isFreestyle = false;
if(location.search.includes('freestyle')) {
  isFreestyle = true;
  document.body.setAttribute('data-is-freestyle', '');
}
let headerCells:HTMLTableCellElement[] = [];
let prompts:string[] = [];
let promptsIndex = 0;
let promptsRemaining:number;

const onDOMContentLoaded = () => {
  recorder.init();
  events.init();
  if(!isFreestyle) events.initForPredefined();
  helpers.init();
}

const onRecordingStarted = async() => {
  if(isFreestyle) {
    helpers.playSound('start', () => recorder.start());
    formatTextToTable('');
    return
  }
  
  if(promptsIndex === 0) {
    headerCells = events.getHeaderCells();
    prompts = events.getPrompts();
  }
  headerCells.forEach(header => header.classList.remove('is-focused'));
  headerCells[promptsIndex].classList.add('is-focused');
  const thisPrompt = prompts[promptsIndex];
  promptsIndex++;
  promptsRemaining = prompts.length - promptsIndex;
  document.body.classList.remove('is-last-prompt');
  if(promptsRemaining === 0) document.body.classList.add('is-last-prompt');
  helpers.speak(thisPrompt, () => helpers.playSound('start', () => recorder.start()));
}

const onRecordingStopped = async() => {
  if(!isFreestyle && promptsRemaining > 0) {
    recorder.stop();
    recorder.insertMarker();
    events.toggleRecordingState();
    return;
  }

  recorder.stop();
  if(headerCells.length) headerCells.forEach(header => header.classList.remove('is-focused'));
  helpers.setState('transcribing');
  helpers.playSound('end');
  helpers.toggleLoader();
  const wavBlob = recorder.getWavBlob();
  const transcribedText = await transcriber(wavBlob);
  formatTextToTable(transcribedText, prompts);
  helpers.playSound('success');
  helpers.toggleLoader();
  promptsIndex = 0;
  helpers.removeState('transcribing');
}

document.body.appendChild(generateDomElements(isFreestyle));
document.addEventListener('DOMContentLoaded', () => onDOMContentLoaded());
document.addEventListener('onRecordingStarted', () => onRecordingStarted());
document.addEventListener('onRecordingStopped', () => onRecordingStopped());
