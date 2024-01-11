import { tabFocusTrap } from "./Helpers";
import { settingsToggle, changeMode, darkThemeToggle } from "./../components/Settings";
import { toggleRecordingState } from "./../components/WavEncoderRecorder";
import { addColumn, downloadCSV } from "./../components/Table";

let toggleRecordingBtn:HTMLButtonElement;
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

  toggleRecordingBtn?.addEventListener('click', e => onToggleRecordingBtnClicked(e));
  addColumnBtn?.addEventListener('click', e => onAddColumnBtnClicked(e));
  settingsToggleBtns?.forEach(btn => btn.addEventListener('click', e => onSettingsToggleBtnClicked(e)));
  modeChangerBtns?.forEach(btn => btn.addEventListener('click', e => onModeChangerBtnClicked(e)));
  darkThemeToggleBtn?.addEventListener('click', e => onDarkThemeToggleBtnClicked(e));
  downloadBtn?.addEventListener('click', e => onDownloadBtnClicked(e));

  document.body.onkeyup = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) onEnterPressed(e);
    else if (e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9) onTabPressed(e);
    else if (e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.keyCode === 39) onArrowRightPressed(e);
  }

  document.body.onkeydown = e => {
    if(e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) e.preventDefault();
    else if (e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9) e.preventDefault();
    else if (e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.keyCode === 39) e.preventDefault();
  }
}

const onToggleRecordingBtnClicked = (e:MouseEvent|KeyboardEvent) => {
  toggleRecordingState(e);
}

const onAddColumnBtnClicked = (e:MouseEvent|KeyboardEvent) => {
  addColumn(e);
}

const onSettingsToggleBtnClicked = (e:MouseEvent) => {
  settingsToggle(e);
}

const onModeChangerBtnClicked = (e:MouseEvent) => {
  changeMode(e);
}

const onDarkThemeToggleBtnClicked = (e:MouseEvent) => {
  darkThemeToggle(e);
}

const onDownloadBtnClicked = (e:MouseEvent) => {
  downloadCSV(e);
}

const onEnterPressed = onToggleRecordingBtnClicked;

const onTabPressed = (e:KeyboardEvent) => {
  tabFocusTrap(e);
}

const onArrowRightPressed = onAddColumnBtnClicked;
