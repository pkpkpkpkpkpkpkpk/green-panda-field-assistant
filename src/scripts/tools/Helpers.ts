import { ATTR_RECORDING, ATTR_TRANSCRIBING, CLASS_HIDDEN } from './Constants';

let loaderEl:HTMLDivElement;
let startSound:HTMLAudioElement;
let endSound:HTMLAudioElement;
let successSound:HTMLAudioElement;

let isLoading = false;

export const init = () => {
  loaderEl = document.querySelector('[data-loader]');

  startSound = new Audio('sounds/start.wav');
  endSound = new Audio('sounds/end.wav');
  successSound = new Audio('sounds/success.wav');
}

export const toggleLoader = () => {
  if(!isLoading) {
    loaderEl.classList.remove(CLASS_HIDDEN);
    isLoading = true;
  } else {
    loaderEl.classList.add(CLASS_HIDDEN);
    isLoading = false;
  }
}

export const playSound = (sound:'start'|'end'|'success', onEnd?:() => void) => {
  let soundEl:HTMLAudioElement;
  const soundName = `${sound}Sound`;
  soundEl = eval(soundName);

  if(onEnd) soundEl.onended = onEnd;

  soundEl.play();
}

export const setState = (state:'recording'|'transcribing') => {
  switch (state) {
    case 'recording':
      document.body.setAttribute(ATTR_RECORDING, '');
      break;
    case 'transcribing':
      document.body.setAttribute(ATTR_TRANSCRIBING, '');
      break;
  }
}

export const removeState = (state:'recording'|'transcribing') => {
  switch (state) {
    case 'recording':
      document.body.removeAttribute(ATTR_RECORDING);
      break;
    case 'transcribing':
      document.body.removeAttribute(ATTR_TRANSCRIBING);
      break;
  }
}

export const speak = (text:string, onEnd?:() => void) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices()[40];
  if(onEnd) utterance.onend = onEnd;
  speechSynthesis.speak(utterance);
}
