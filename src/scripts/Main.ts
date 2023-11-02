import generateDomElements from './elements/GenerateDomElements';
import * as constants from './tools/Constants';
import * as helpers from './tools/Helpers';
import * as events from './components/Events';
import * as recorder from './components/WavEncoderRecorder';
import transcriber from './components/Transcriber';
import formatTextToTable from './components/FormatTextToTable';

let headerCells:HTMLTableCellElement[] = [];
let prompts:string[] = [];
let promptsIndex = 0;
let promptsRemaining:number;
let time:number;
let startTime:number;

const onDOMContentLoaded = () => {
  helpers.init();
  events.init();
  recorder.init();
}

const onRecordingStarted = async() => {
  events.disableDownloadBtn();

  if(helpers.isMode(constants.MODE_FREESTYLE)) {
    helpers.playSound('start', () => recorder.start());
    return;
  }
  
  if(promptsIndex === 0) {
    headerCells = events.getHeaderCells();
    prompts = events.getPrompts();
    time = new Date().getTime();
    if(startTime === undefined) startTime = time;
  }

  if(helpers.isMode(constants.MODE_SPECIFIC)) {
    headerCells.forEach(header => header.classList.add('is-focused'));
    document.body.classList.add('is-last-prompt');
    helpers.playSound('start', () => recorder.start());
    return;
  }

  headerCells.forEach(header => header.classList.remove('is-focused'));
  headerCells[promptsIndex].classList.add('is-focused');
  helpers.scrollTo('none', 'left', document.querySelector('[data-output-main]'), headerCells[promptsIndex]);
  const thisPrompt = prompts[promptsIndex];
  promptsIndex++;
  promptsRemaining = prompts.length - promptsIndex;
  document.body.classList.remove('is-last-prompt');
  if(promptsRemaining === 0) document.body.classList.add('is-last-prompt');
  helpers.speak(thisPrompt, () => helpers.playSound('start', () => recorder.start()));
}

const onRecordingStopped = async() => {
  if(!helpers.isMode(constants.MODE_FREESTYLE) && promptsRemaining > 0) {
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
  helpers.scrollTo('bottom', 'left', document.querySelector('[data-output-main]'));
  const wavBlob = recorder.getWavBlob();
  const transcribedText = await transcriber(wavBlob);
  formatTextToTable(transcribedText, prompts, time, startTime);
  helpers.playSound('success');
  helpers.toggleLoader();
  events.enableDownloadBtn();
  promptsIndex = 0;
  helpers.removeState('transcribing');
}

document.body.appendChild(generateDomElements());
document.addEventListener('DOMContentLoaded', () => onDOMContentLoaded());
document.addEventListener(constants.EVENT_ON_RECORDING_STARTED, () => onRecordingStarted());
document.addEventListener(constants.EVENT_ON_RECORDING_STOPPED, () => onRecordingStopped());
