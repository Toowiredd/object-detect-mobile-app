let trackedObjects = [];

export const trackObjects = (detections) => {
  // Simple tracking logic: match detections with existing tracked objects
  detections.forEach((detection) => {
    const existingObject = trackedObjects.find(
      (obj) => obj.class === detection.class && iou(obj.box, detection.box) > 0.5
    );
    if (existingObject) {
      existingObject.box = detection.box;
      existingObject.score = detection.score;
    } else {
      trackedObjects.push(detection);
    }
  });

  // Remove objects not detected in the current frame
  trackedObjects = trackedObjects.filter((obj) =>
    detections.some((detection) => iou(obj.box, detection.box) > 0.5)
  );

  return trackedObjects;
};

const iou = (box1, box2) => {
  const [x1, y1, x2, y2] = box1;
  const [x3, y3, x4, y4] = box2;

  const xi1 = Math.max(x1, x3);
  const yi1 = Math.max(y1, y3);
  const xi2 = Math.min(x2, x4);
  const yi2 = Math.min(y2, y4);
  const interArea = Math.max(0, xi2 - xi1) * Math.max(0, yi2 - yi1);

  const box1Area = (x2 - x1) * (y2 - y1);
  const box2Area = (x4 - x3) * (y4 - y3);

  const unionArea = box1Area + box2Area - interArea;

  return interArea / unionArea;
};