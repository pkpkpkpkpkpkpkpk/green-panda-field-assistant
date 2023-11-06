import { env, pipeline } from '@xenova/transformers';
import { WaveFile } from 'wavefile';
import { Buffer } from 'buffer';

export default async(wavBlob:Blob):Promise<string> => {
  const arrayBuffer = await wavBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const wav = new WaveFile(buffer);
  wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  const sampleRate = 16000; // Whisper expects audio with a sampling rate of 16000
  wav.toSampleRate(sampleRate); 
  const audioData = wav.getSamples();
  // const audioLengthInSeconds = audioData.length / sampleRate;

  //use local models to transcribe (works offline)
  // //@ts-ignore
  // env.allowRemoteModels = false;
  // env.localModelPath = 'models/';
  // env.backends.onnx.wasm.wasmPaths = 'wasm/';

  const task = 'automatic-speech-recognition';
  const model = 'Xenova/whisper-tiny.en';

  console.log('initialising model...');
  const transcriber = await pipeline(task, model);

  console.log('transcribing...');
  const result = await transcriber(audioData, { language: 'english' });

  console.log('result:', result.text);
  return result.text;
}
