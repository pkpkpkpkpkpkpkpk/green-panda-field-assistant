let toggleRecordingBtn:HTMLButtonElement;

let isRecording = false;

export default () => {
  toggleRecordingBtn = document.querySelector('[data-toggle-recording]');

  toggleRecordingBtn?.addEventListener('click', e => toggleRecordingState(e));

  document.body.onkeyup = e => {
    if(e.key == ' ' || e.code == 'Space' || e.keyCode == 32) toggleRecordingState(e);
  }
}

const toggleRecordingState = (e:MouseEvent|KeyboardEvent) => {
  e.preventDefault();

  if(!isRecording) {
    startRecording();
    return;
  }

  stopRecording();
}

const startRecording = () => {
  document.dispatchEvent(new Event('onRecordingStarted'));

  isRecording = true;
}

const stopRecording = () => {
  document.dispatchEvent(new Event('onRecordingStopped'));

  isRecording = false;
}
