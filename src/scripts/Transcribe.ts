import { pipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile';
import { Buffer } from 'buffer';
import { formatTextToTable } from './FormatTextToTable';

export const transcribe = async(wavBlob:Blob) => {
  const arrayBuffer = await wavBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const wav = new WaveFile(buffer);
  wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  const audioData = wav.getSamples();

  const task = 'automatic-speech-recognition';
  const model = 'Xenova/whisper-tiny.en';

  console.log('downloading model...');
  formatTextToTable('downloading model');
  const transcriber = await pipeline(task, model);

  console.log('transcribing...');
  formatTextToTable('transcribing');
  const result = await transcriber(audioData);

  formatTextToTable(result.text);
  console.log(result.text);
};
