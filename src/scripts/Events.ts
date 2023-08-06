import * as helpers from './tools/Helpers';
import { ATTR_TRANSCRIBING, CLASS_HIDDEN } from './tools/Constants';

let toggleRecordingBtn:HTMLButtonElement;
let columnsInput:HTMLInputElement;
let outputTable:HTMLTableElement;

let isRecording = false;

export const init = () => {
  toggleRecordingBtn = document.querySelector('[data-toggle-recording]');

  toggleRecordingBtn?.addEventListener('click', e => toggleRecordingState(e));

  document.body.onkeyup = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) toggleRecordingState(e);
  }

  document.body.onkeydown = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      try { (document.activeElement as HTMLElement).blur(); } 
      catch (error) { console.log('active element cannot be blurred') }
    }
  }
}

export const toggleRecordingState = (e?:MouseEvent|KeyboardEvent) => {
  e?.preventDefault();

  if(!document.body.hasAttribute('data-is-freestyle')) {
    columnsInput = document.querySelector('[data-columns-input]');
    if(!columnsInput || !columnsInput.value || parseInt(columnsInput.value) <= 0) return;
  }

  if(document.body.hasAttribute(ATTR_TRANSCRIBING)) return;

  if(!isRecording) {
    startRecording();
    return;
  }

  stopRecording();
}

const startRecording = () => {
  isRecording = true;
  helpers.setState('recording');
  document.dispatchEvent(new Event('onRecordingStarted'));
}

const stopRecording = () => {
  isRecording = false;
  helpers.removeState('recording');
  document.dispatchEvent(new Event('onRecordingStopped'));
}

export const initForPredefined = () => {
  columnsInput = document.querySelector('[data-columns-input]');
  outputTable = document.querySelector('[data-output-table]');
  if(!columnsInput || !outputTable) return;

  columnsInput.addEventListener('input', () => {
    while (outputTable.firstChild) outputTable.removeChild(outputTable.firstChild);
    outputTable.classList.remove('is-docs');

    const rowEl = document.createElement('tr');

    const columnsCount = parseInt(columnsInput.value);
    for (let i = 0; i < columnsCount; i++) {
      const cellEl = document.createElement('th');
      cellEl.setAttribute('contenteditable', '');
      rowEl.appendChild(cellEl);
    };

    outputTable.appendChild(rowEl);
  });
}

export const getHeaderCells = () => {
  columnsInput = document.querySelector('[data-columns-input]');
  outputTable = document.querySelector('[data-output-table]');
  if(!columnsInput || !outputTable) return;

  columnsInput.classList.add(CLASS_HIDDEN);

  const columns = Array.from(outputTable.querySelectorAll('th'));
  return columns;
}

export const getPrompts = () => {
  const columns = getHeaderCells();
  const prompts = columns.map(c => c.innerHTML);
  return prompts;
}
