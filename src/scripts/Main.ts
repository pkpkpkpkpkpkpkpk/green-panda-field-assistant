import mainElement from './elements/MainElement';
import * as constants from './tools/Constants';
import * as helpers from './tools/Helpers';
import * as events from './tools/Events';
import * as settings from './components/Settings';
import * as recorder from './components/WavEncoderRecorder';
import * as tableMethods from './components/Table';

let headerCells:HTMLTableCellElement[] = [];
let prompts:string[] = [];
let promptsIndex = 0;
let promptsRemaining:number;
let time:number;
let startTime:number;
let transcribingQueueCount = 0;

const onDOMContentLoaded = () => {
  helpers.init();
  events.init();
  settings.init();
  recorder.init();
}

const onRecordingStart = async() => {
  helpers.setState('recording');

  if(helpers.isMode(constants.MODE_FREESTYLE)) {
    helpers.playAudio('start', () => recorder.start());
    return;
  }
  
  if(promptsIndex === 0) {
    headerCells = tableMethods.getHeaderCells();
    prompts = tableMethods.getPrompts();
    time = new Date().getTime();
    if(startTime === undefined) startTime = time;
  }

  if(helpers.isMode(constants.MODE_SPECIFIC)) {
    headerCells.forEach(header => header.classList.add('is-focused'));
    document.body.classList.add('is-last-prompt');
    helpers.playAudio('start', () => recorder.start());
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
  helpers.speak(thisPrompt, () => helpers.playAudio('start', () => recorder.start()));
}

const onRecordingStop = async() => {
  if(!helpers.isMode(constants.MODE_FREESTYLE) && promptsRemaining > 0) {
    recorder.stop(); //pause recorder
    recorder.insertMarker(); //insert marker audio
    onRecordingStart(); //restart recorder
    return;
  }

  recorder.stop(); //end recorder
  if(headerCells.length) headerCells.forEach(header => header.classList.remove('is-focused'));
  helpers.playAudio('end');
  helpers.scrollTo('bottom', 'left', document.querySelector('[data-output-main]'));
  const wavBlob = recorder.getWavBlob();
  helpers.removeState('recording');
  onTranscriptionStart(wavBlob, time);
}

const onTranscriptionStart = (wavBlob:Blob, thisTime:number) => {
  promptsIndex = 0; //reset variables
  transcribingQueueCount++;
  helpers.setState('transcribing');

  if(!window.Worker) return;
  const transcriberWorker = new Worker(new URL('./workers/Transcriber.ts', import.meta.url));
  transcriberWorker.postMessage(wavBlob);
  transcriberWorker.onmessage = e => {
    const transcribedText:string = e.data;
    transcriberWorker.terminate();
    onTranscriptionComplete(transcribedText, thisTime);
  }
}

const onTranscriptionComplete = (transcribedText:string, thisTime:number) => {
  tableMethods.formatTextToTable(transcribedText, prompts, thisTime, startTime);
  helpers.playAudio('success');
  transcribingQueueCount--;
  if(transcribingQueueCount === 0) helpers.removeState('transcribing');
}

document.body.appendChild(mainElement());
document.addEventListener('DOMContentLoaded', () => onDOMContentLoaded());
document.addEventListener(constants.EVENT_ON_RECORDING_STARTED, () => onRecordingStart());
document.addEventListener(constants.EVENT_ON_RECORDING_STOPPED, () => onRecordingStop());
