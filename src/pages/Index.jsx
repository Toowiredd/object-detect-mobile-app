import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { detectObjects } from "@/utils/objectDetection";
import { trackObjects } from "@/utils/objectTracking"; // Import the tracking function
import { Camera, Settings, HelpCircle, Save } from "lucide-react"; // Import Save icon

const Index = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [trackedObjects, setTrackedObjects] = useState([]); // State for tracked objects
  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraActive) {
      const video = videoRef.current;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
      });
    }
  }, [cameraActive]);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const detections = await detectObjects(canvas);
    setDetections(detections);
    const tracked = trackObjects(detections); // Track objects across frames
    setTrackedObjects(tracked);
  };

  const handleSwitchCamera = () => {
    // Logic for switching camera
  };

  const handleSettings = () => {
    // Logic for opening settings
  };

  const handleHelp = () => {
    // Logic for opening help/tutorial
  };

  const handleSaveResults = () => {
    const results = {
      detections,
      trackedObjects,
      timestamp: new Date().toISOString(),
    };
    const savedResults = JSON.parse(localStorage.getItem("detectionResults")) || [];
    savedResults.push(results);
    localStorage.setItem("detectionResults", JSON.stringify(savedResults));
    alert("Detection results saved!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        <p className="text-lg text-muted-foreground">
          Discover the amazing features we have to offer.
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md h-64 bg-gray-200 rounded-lg overflow-hidden">
          {cameraActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
              <Button variant="outline" size="icon" onClick={handleCapture}>
                <Camera className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button variant="primary" onClick={() => setCameraActive(true)}>
                Activate Camera
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <Button variant="outline" size="icon" onClick={handleSwitchCamera}>
          <Camera className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleSettings}>
          <Settings className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleHelp}>
          <HelpCircle className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleSaveResults}>
          <Save className="h-6 w-6" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/placeholder.svg" alt="placeholder" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Explore the first feature of our app. It provides amazing benefits and functionalities.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 2</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/placeholder.svg" alt="placeholder" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Discover the second feature of our app. It enhances your experience and productivity.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 3</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/placeholder.svg" alt="placeholder" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Learn about the third feature of our app. It offers unique capabilities and advantages.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center mt-8">
        <Button variant="primary" size="lg">Get Started</Button>
      </div>
    </div>
  );
};

export default Index;