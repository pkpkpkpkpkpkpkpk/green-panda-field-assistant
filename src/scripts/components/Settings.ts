import Cookies from 'js-cookie';
import * as constants from './../tools/Constants';
import { focusOnFirstCell } from './Table';

let settingsToggleBtns:NodeListOf<HTMLButtonElement>;
let modeChangerBtns:NodeListOf<HTMLButtonElement>;
let downloadBtn:HTMLButtonElement;

export const init = () => {
  settingsToggleBtns = document.querySelectorAll(constants.SELECTOR_SETTINGS_TOGGLE);
  modeChangerBtns = document.querySelectorAll(constants.SELECTOR_MODE_CHANGER);

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

export const settingsToggle = (e:MouseEvent) => {
  e.preventDefault();
  document.body.toggleAttribute(constants.ATTR_SETTINGS_OPEN);
  focusOnFirstCell();
}

export const changeMode = (e:MouseEvent) => {
  e.preventDefault();
  const self = e.target as HTMLButtonElement;
  const newMode = self.getAttribute(constants.ATTR_MODE);
  document.body.setAttribute(constants.ATTR_MODE, newMode);
  Cookies.set(constants.COOKIE_MODE, newMode);
  modeChangerBtns.forEach(btn => btn.classList.remove(constants.CLASS_ACTIVE));
  self.classList.add(constants.CLASS_ACTIVE);
  settingsToggleBtns[0].click();
}

export const darkThemeToggle = (e:MouseEvent) => {
  e.preventDefault();
  focusOnFirstCell();
  document.body.toggleAttribute(constants.ATTR_DARK_THEME);
  if(document.body.hasAttribute(constants.ATTR_DARK_THEME)) {
    Cookies.set(constants.COOKIE_DARK_THEME, constants.COOKIE_DARK_THEME_VALUE);
    return;
  }
  Cookies.remove(constants.COOKIE_DARK_THEME);
}

export const enableDownload = () => {
  downloadBtn = document.querySelector(constants.SELECTOR_DOWNLOAD);
  downloadBtn.removeAttribute(constants.ATTR_DISABLED);
  downloadBtn.classList.remove(constants.CLASS_DISABLED);
}
