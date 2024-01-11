import * as constants from './../tools/Constants';

let startAudio:HTMLAudioElement;
let endAudio:HTMLAudioElement;
let successAudio:HTMLAudioElement;

export const init = () => {
  startAudio = new Audio('audio/start.wav');
  endAudio = new Audio('audio/end.wav');
  successAudio = new Audio('audio/success.wav');
}

export const playAudio = (audio:'start'|'end'|'success', onEnd?:() => void) => {
  let audioEl:HTMLAudioElement;
  const audioName = `${audio}Audio`;
  audioEl = eval(audioName);
  if(onEnd) audioEl.onended = onEnd;
  audioEl.play();
}

export const setState = (state:'recording'|'transcribing') => {
  switch (state) {
    case 'recording':
      document.body.setAttribute(constants.ATTR_RECORDING, '');
      break;
    case 'transcribing':
      document.body.setAttribute(constants.ATTR_TRANSCRIBING, '');
      break;
  }
}

export const removeState = (state:'recording'|'transcribing') => {
  switch (state) {
    case 'recording':
      document.body.removeAttribute(constants.ATTR_RECORDING);
      break;
    case 'transcribing':
      document.body.removeAttribute(constants.ATTR_TRANSCRIBING);
      break;
  }
}

export const isState = (state:'recording'|'transcribing') => {
  switch (state) {
    case 'recording':
      return document.body.hasAttribute(constants.ATTR_RECORDING);
    case 'transcribing':
      return document.body.hasAttribute(constants.ATTR_TRANSCRIBING);
  }
}

export const isMode = (mode:'default'|'specific'|'freestyle') => {
  if(document.body.getAttribute(constants.ATTR_MODE) === mode) return true;
  return false;
}

export const speak = (text:string, onEnd?:() => void) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices()[40];
  if(onEnd) utterance.onend = onEnd;
  speechSynthesis.speak(utterance);
}

const getAlphabetFromIndex = (index:number) => {
  const indexModulo = modulo(index, 26);
  const alph = 'abcdefghijklmnopqrstuvwxyz';
  const indexAlph = alph[indexModulo];
  return indexAlph;
}

export const getAlphabetDepthFromIndex = (index:number) => {
  //only 702 unique combos until it restarts
  const indexAlph = getAlphabetFromIndex(index);
  const depth = Math.floor(index / 26) - 1;
  let depthAlph = getAlphabetFromIndex(depth);
  if(!depthAlph) depthAlph = '';
  const indexAlphDepth = depthAlph + indexAlph;
  return indexAlphDepth;
}

export const modulo = (n:number, d:number) => {
  return ((n % d) + d) % d;
}

export const scrollTo = (yDirection:'top'|'bottom'|'none', xDirection:'left'|'right'|'none', containerElement:HTMLElement, relativeElement?:HTMLElement) => {
  switch (yDirection) {
    case 'top':
      if(relativeElement) {
        containerElement.scrollTop = relativeElement.offsetTop;
        break;
      }
      containerElement.scrollTop = 0;
      break;
    case 'bottom':
      if(relativeElement) {
        containerElement.scrollTop = relativeElement.offsetTop + relativeElement.offsetHeight;
        break;
      }
      containerElement.scrollTop = containerElement.scrollHeight;
      break;
    case 'none':
      break;
  }
  
  switch (xDirection) {
    case 'left':
      if(relativeElement) {
        containerElement.scrollLeft = relativeElement.offsetLeft;
        break
      }
      containerElement.scrollLeft = 0;
      break;
    case 'right':
      if(relativeElement) {
        containerElement.scrollLeft = relativeElement.offsetLeft + relativeElement.offsetWidth;
        break
      }
      containerElement.scrollLeft = containerElement.scrollWidth;
      break;
    case 'none':
      break;
  }
}

export const tabFocusTrap = (e:KeyboardEvent) => {
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

const selectTextUponFocus = (element:HTMLElement) => {
  if(!(element.nodeName === 'TH' || element.nodeName === 'TD') || !window.getSelection) return;
  let selection = window.getSelection();        
  let range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}
