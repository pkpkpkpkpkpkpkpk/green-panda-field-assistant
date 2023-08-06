import * as recordingMarker from './RecordingMarker.json';

const config = {
  numChannels: 1,
  bufferLen: 4096,
}

let isRecording = false;
let recLength = 0;
let recBuffers:Float32Array[][] = [];
let sampleRate:number;

export const init = async() => {
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia not supported on your browser!');
  }
  
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaStreamSource(mediaStream);
  const context = audioSource.context;
  const node:ScriptProcessorNode = context.createScriptProcessor.call(
    context, config.bufferLen, config.numChannels, config.numChannels
  );

  sampleRate = context.sampleRate | 44100;
  
  node.onaudioprocess = e => {
    if (!isRecording) return;

    let buffer:Float32Array[] = [];
    for (let channel = 0; channel < config.numChannels; channel++) {
      buffer.push(e.inputBuffer.getChannelData(channel));
    }  
    
    const bufferBase64 = buffer.map(b => btoa(String.fromCharCode(...(new Uint8Array(b.buffer)))));

    record(bufferBase64);
  };

  audioSource.connect(node);
  node.connect(context.destination); //this should not be necessary

  initBuffers();
}

export const start = () => {
  isRecording = true;
}

export const stop = () => {
  isRecording = false;
}

export const insertMarker = () => {
  const markerLength = 49152;
  const markerArray:string[] = Array.from(recordingMarker);
  let buffers:Float32Array[][] = [];
  for (let channel = 0; channel < config.numChannels; channel++) {
    buffers[channel] = markerArray.map(b => new Float32Array(new Uint8Array([...atob(b)].map(c => c.charCodeAt(0))).buffer));
    recBuffers[channel].push(...buffers[channel]);
  }
  recLength += markerLength;
}

export const getWavBlob = () => {
  let buffers = [];
  for (let channel = 0; channel < config.numChannels; channel++) {
    buffers.push(mergeBuffers(recBuffers[channel], recLength));
  }
  let interleaved;
  if (config.numChannels === 2) {
    interleaved = interleave(buffers[0], buffers[1]);
  } else {
    interleaved = buffers[0];
  }
  let dataview = encodeWav(interleaved);
  let audioBlob = new Blob([dataview], { type: 'audio/wav' });

  clearBuffers();

  return audioBlob;
}

const initBuffers = () => {
  for (let channel = 0; channel < config.numChannels; channel++) {
    recBuffers[channel] = [];
  }
}

const record = (bufferBase64:string[]) => {
  const buffer = bufferBase64.map(b => new Float32Array(new Uint8Array([...atob(b)].map(c => c.charCodeAt(0))).buffer));

  for (let channel = 0; channel < config.numChannels; channel++) {
    recBuffers[channel].push(buffer[channel]);
  }
  recLength += buffer[0].length;
}

const mergeBuffers = (recBufferChannel:Float32Array[], recLength:number) => {
  let result = new Float32Array(recLength);
  let offset = 0;
  for (let i = 0; i < recBufferChannel.length; i++) {
    result.set(recBufferChannel[i], offset);
    offset += recBufferChannel[i].length;
  }
  return result;
}

const interleave = (inputL:Float32Array, inputR:Float32Array) => {
  let length = inputL.length + inputR.length;
  let result = new Float32Array(length);

  let index = 0,
    inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

const floatTo16BitPCM = (output:DataView, offset:number, input:Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

const writeString = (view:DataView, offset:number, string:string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

const encodeWav = (samples:Float32Array) => {
  let buffer = new ArrayBuffer(44 + samples.length * 2);
  let view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, config.numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, config.numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}

const clearBuffers = () => {
  recLength = 0;
  recBuffers = [];
  initBuffers();
}
