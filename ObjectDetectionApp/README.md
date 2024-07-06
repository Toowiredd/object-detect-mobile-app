# ObjectDetectionApp

This is a cross-platform mobile application designed for real-time object detection using React Native and TensorFlow Lite.

## Setup

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Start the App**:
   ```sh
   npm start
   ```

3. **Run on Android**:
   ```sh
   npm run android
   ```

4. **Run on iOS**:
   ```sh
   npm run ios
   ```

## Features

- **Camera Integration**: Access the device's camera and display a live video feed.
- **Object Detection**: Perform real-time object detection using TensorFlow Lite.
- **Bounding Box Display**: Draw bounding boxes around detected objects on the camera feed.
- **User Interface**: Minimal UI with start/stop detection button and status indicator.

## Directory Structure

- `App.js`: Main application file.
- `package.json`: Project dependencies and scripts.
- `README.md`: Project documentation.

## Notes

- Ensure you have the necessary permissions to access the camera on your device.
- The object detection model used is a placeholder. Replace it with your own model for better accuracy.