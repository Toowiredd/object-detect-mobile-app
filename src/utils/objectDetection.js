import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

let models = {};
let currentModel = 'efficientdet';

export const loadModel = async (modelName = 'efficientdet') => {
  if (!models[modelName]) {
    let modelUrl;
    switch (modelName) {
      case 'efficientdet':
        modelUrl = 'https://tfhub.dev/tensorflow/efficientdet/lite2/detection/1';
        break;
      case 'yolov5':
        modelUrl = 'https://tfhub.dev/ultralytics/yolov5/1';
        break;
      case 'ssd_mobilenet':
        modelUrl = 'https://tfhub.dev/tensorflow/ssd_mobilenet_v2/2';
        break;
      default:
        throw new Error('Model not supported');
    }
    models[modelName] = await loadGraphModel(modelUrl);
  }
  currentModel = modelName;
};

export const detectObjects = async (image) => {
  if (!models[currentModel]) {
    await loadModel(currentModel);
  }

  const tensor = tf.browser.fromPixels(image).expandDims(0).toFloat().div(tf.scalar(255));
  const predictions = await models[currentModel].executeAsync(tensor);

  const boxes = predictions[0].arraySync();
  const scores = predictions[1].arraySync();
  const classes = predictions[2].arraySync();

  return boxes.map((box, i) => ({
    box,
    score: scores[i],
    class: classes[i],
  }));
};