import Cookies from 'js-cookie';
import * as constants from './../tools/Constants';
import * as helpers from './../tools/Helpers';

let toggleRecordingBtn:HTMLButtonElement;
let outputMain:HTMLDivElement;
let outputTable:HTMLTableElement;
let addColumnBtn:HTMLButtonElement;
let settingsToggleBtns:NodeListOf<HTMLButtonElement>;
let modeChangerBtns:NodeListOf<HTMLButtonElement>;
let darkThemeToggleBtn:HTMLButtonElement;
let downloadBtn:HTMLButtonElement;

export const init = () => {
  toggleRecordingBtn = document.querySelector('[data-toggle-recording]');
  addColumnBtn = document.querySelector('[data-add-column]');
  settingsToggleBtns = document.querySelectorAll('[data-settings-toggle]');
  modeChangerBtns = document.querySelectorAll('[data-mode-changer]');
  darkThemeToggleBtn = document.querySelector('[data-dark-theme-toggle]');
  downloadBtn = document.querySelector('[data-download]');

  toggleRecordingBtn?.addEventListener('click', e => toggleRecordingState(e));
  addColumnBtn?.addEventListener('click', e => addColumn(e));
  settingsToggleBtns?.forEach(btn => btn.addEventListener('click', e => settingsToggle(e)));
  modeChangerBtns?.forEach(btn => btn.addEventListener('click', e => changeMode(e)));
  darkThemeToggleBtn?.addEventListener('click', e => darkThemeToggle(e));
  downloadBtn?.addEventListener('click', e => downloadCSV(e));

  document.body.onkeyup = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) toggleRecordingState(e);
    else if (e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9) tabFocusTrap(e);
    else if (e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.keyCode === 39) addColumn(e);
  }

  document.body.onkeydown = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) e.preventDefault();
    else if (e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9) e.preventDefault();
    else if (e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.keyCode === 39) e.preventDefault();
  }

  getSavedSettingsFromCookies();
}

export const toggleRecordingState = (e?:MouseEvent|KeyboardEvent) => {
  e?.preventDefault();

  //remove focus state and text selection
  try { (document.activeElement as HTMLElement).blur(); } 
  catch (error) { console.log('active element cannot be blurred') }
  window.getSelection()?.removeAllRanges();

  removeDocs();
  downloadBtn.setAttribute('disabled', '');
  downloadBtn.classList.add('is-disabled');
  
  helpers.scrollTo('top', 'left', document.querySelector('[data-output-main]'));

  if(!helpers.isState('recording')) {
    document.dispatchEvent(new Event(constants.EVENT_ON_RECORDING_STARTED));
    return;
  }

  document.dispatchEvent(new Event(constants.EVENT_ON_RECORDING_STOPPED));
}

export const getHeaderCells = () => {
  outputTable = document.querySelector('[data-output-table]');
  if(!outputTable) return;
  
  const columns = Array.from(outputTable.querySelectorAll('th'));
  if(columns[0].hasAttribute('data-time')) columns.shift();
  return columns;
}

export const getPrompts = () => {
  const columns = getHeaderCells();
  const prompts = columns.map(c => c.innerHTML);
  return prompts;
}

export const enableDownloadBtn = () => {
  downloadBtn.removeAttribute('disabled');
  downloadBtn.classList.remove('is-disabled');
}

export const disableDownloadBtn = () => {
  downloadBtn.setAttribute('disabled', '');
  downloadBtn.classList.add('is-disabled');
}

const addColumn = (e?:MouseEvent|KeyboardEvent) => {
  e.preventDefault();
  outputTable = document.querySelector('[data-output-table]');
  const rows = outputTable.querySelectorAll('tr');
  const columnCount = rows.length && rows[0].querySelectorAll('th, td').length;
  
  rows.forEach((row, index) => {
    if(!helpers.isMode(constants.MODE_FREESTYLE) && index === 0) {
      const newHeaderCell = document.createElement('th');
      newHeaderCell.setAttribute('contenteditable', '');
      newHeaderCell.setAttribute('data-index', `${helpers.getAlphabetDepthFromIndex(columnCount)}0`);
      row.appendChild(newHeaderCell);
      newHeaderCell.focus();
      return;
    }
    
    const newCell = document.createElement('td');
    newCell.setAttribute('contenteditable', '');
    const cellIndex = `${helpers.getAlphabetDepthFromIndex(columnCount)}${index}`;
    newCell.setAttribute('data-index', `${helpers.getAlphabetDepthFromIndex(columnCount)}${cellIndex}`);
    row.appendChild(newCell);
  });

  removeDocs();
}

const removeDocs = () => {
  outputTable = document.querySelector('[data-output-table]');
  outputTable.querySelectorAll('[data-docs]').forEach(docs => docs.remove());
  outputTable.classList.remove('is-docs');
}

const settingsToggle = (e:MouseEvent) => {
  e.preventDefault();
  document.body.toggleAttribute(constants.ATTR_SETTINGS_OPEN);

  focusOnFirstCell();
}

const changeMode = (e:MouseEvent) => {
  e.preventDefault();
  const self = e.target as HTMLButtonElement;
  const newMode = self.getAttribute(constants.ATTR_MODE);
  document.body.setAttribute(constants.ATTR_MODE, newMode);
  Cookies.set(constants.COOKIE_MODE, newMode);
  modeChangerBtns.forEach(btn => btn.classList.remove(constants.CLASS_ACTIVE));
  self.classList.add(constants.CLASS_ACTIVE);
  settingsToggleBtns[0].click();
}

const darkThemeToggle = (e:MouseEvent) => {
  e.preventDefault();
  focusOnFirstCell();
  document.body.toggleAttribute(constants.ATTR_DARK_THEME);
  if(document.body.hasAttribute(constants.ATTR_DARK_THEME)) {
    Cookies.set(constants.COOKIE_DARK_THEME, constants.COOKIE_DARK_THEME_VALUE);
    return;
  }
  Cookies.remove(constants.COOKIE_DARK_THEME);
}

const downloadCSV = (e:MouseEvent) => {
  e.preventDefault();
  outputTable = document.querySelector('[data-output-table]');
  const csv = Array.from(outputTable.querySelectorAll('tr')).map(row => Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent).join(',')).join('\n');
  const csvBlob = new Blob([csv], { type: 'text/plain' });
  const downloadEl = document.createElement('a');
  downloadEl.href = window.URL.createObjectURL(csvBlob);
  const date = new Date;
  downloadEl.download = `output_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;
  downloadEl.click();
}

const tabFocusTrap = (e:KeyboardEvent) => {
  const tabElements = document.querySelectorAll('[tabindex="0"]:not(.is-hidden), [contenteditable]');
  if(!tabElements.length) return;
  
  if(!Array.from(tabElements).includes(document.activeElement)) {
    (tabElements[0] as HTMLElement).focus();
    return;
  }
  
  const isShiftTab = e.shiftKey;
  
  for (let i = 0; i < tabElements.length; i++) {
    if(document.activeElement != tabElements[i]) continue;
    const tabIndex = i + 1;
    const shiftTabIndex = i - 1;
    let nextIndexModulo = helpers.modulo(tabIndex, tabElements.length);
    if(isShiftTab) nextIndexModulo = helpers.modulo(shiftTabIndex, tabElements.length);
    const nextFocusEl = tabElements[nextIndexModulo] as HTMLElement;
    nextFocusEl.focus();
    
    selectTextUponFocus(nextFocusEl);

    break;
  }
}

const getSavedSettingsFromCookies = () => {
  switch (Cookies.get(constants.COOKIE_MODE)) {
    case constants.MODE_SPECIFIC:
      document.body.setAttribute(constants.ATTR_MODE, constants.MODE_SPECIFIC);
      break;
    case constants.MODE_FREESTYLE:
      document.body.setAttribute(constants.ATTR_MODE, constants.MODE_FREESTYLE);
      break;
    }

  modeChangerBtns.forEach(btn => btn.classList.remove(constants.CLASS_ACTIVE));
  const activeModeBtn = Array.from(modeChangerBtns).find(btn => btn.getAttribute(constants.ATTR_MODE) === document.body.getAttribute(constants.ATTR_MODE));
  if(activeModeBtn) activeModeBtn.classList.add(constants.CLASS_ACTIVE);
  else modeChangerBtns[0].classList.add(constants.CLASS_ACTIVE);

  if(Cookies.get(constants.COOKIE_DARK_THEME) === constants.COOKIE_DARK_THEME_VALUE) document.body.setAttribute(constants.ATTR_DARK_THEME, '');
}

const selectTextUponFocus = (element:HTMLElement) => {
  if(!(element.nodeName === 'TH' || element.nodeName === 'TD') || !window.getSelection) return;
  let selection = window.getSelection();        
  let range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

const focusOnFirstCell = () => {
  outputMain = document.querySelector('[data-output-main]');
  outputMain.querySelector('th')?.focus();
}
