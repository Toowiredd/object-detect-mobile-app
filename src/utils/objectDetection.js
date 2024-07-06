import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

let model;

export const loadModel = async () => {
  // Update the model URL to a more accurate version if available
  model = await loadGraphModel('https://tfhub.dev/tensorflow/efficientdet/lite2/detection/1');
};

export const detectObjects = async (image) => {
  if (!model) {
    await loadModel();
  }

  const tensor = tf.browser.fromPixels(image).expandDims(0).toFloat().div(tf.scalar(255));
  const predictions = await model.executeAsync(tensor);

  const boxes = predictions[0].arraySync();
  const scores = predictions[1].arraySync();
  const classes = predictions[2].arraySync();

  return boxes.map((box, i) => ({
    box,
    score: scores[i],
    class: classes[i],
  }));
};