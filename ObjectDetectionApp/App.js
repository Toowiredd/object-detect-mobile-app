import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import Canvas from 'react-native-canvas';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await tf.ready();
      const modelJson = require('./model/model.json');
      const modelWeights = require('./model/weights.bin');
      const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
    })();
  }, []);

  const handleCameraStream = async (images) => {
    const loop = async () => {
      if (!isDetecting) return;
      const nextImageTensor = images.next().value;
      if (model && nextImageTensor) {
        const predictions = await model.executeAsync(nextImageTensor);
        drawBoundingBoxes(predictions);
        tf.dispose([nextImageTensor, predictions]);
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  const drawBoundingBoxes = (predictions) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction['bbox'];
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onCameraReady={() => {
          if (cameraRef.current) {
            const cameraStream = cameraRef.current.capture();
            handleCameraStream(cameraStream);
          }
        }}
      />
      <Canvas ref={canvasRef} style={styles.canvas} />
      <Button
        title={isDetecting ? "Stop Detection" : "Start Detection"}
        onPress={() => setIsDetecting(!isDetecting)}
      />
      <Text>{isDetecting ? "Detection Active" : "Detection Inactive"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});