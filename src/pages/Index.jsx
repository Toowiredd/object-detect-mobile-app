import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { detectObjects, loadModel } from "@/utils/objectDetection"; // Import loadModel
import { trackObjects } from "@/utils/objectTracking"; // Import the tracking function
import { Camera, Settings, HelpCircle, Save, Play, PauseCircle } from "lucide-react"; // Import Save, Play, and PauseCircle icons
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup components
import { Label } from "@/components/ui/label"; // Import Label component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components

const ObjectDetectionApp = () => {
  const [isActive, setIsActive] = useState(false);
  const [detectionResults, setDetectionResults] = useState([]);
  const [trackedObjects, setTrackedObjects] = useState([]); // State for tracked objects
  const [selectedOption, setSelectedOption] = useState("option1"); // State for radio group
  const [selectedModel, setSelectedModel] = useState("efficientdet"); // State for selected model
  const [showSettingsModal, setShowSettingsModal] = useState(false); // State for settings modal
  const [showHelpModal, setShowHelpModal] = useState(false); // State for help modal
  const videoRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      const video = videoRef.current;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
      });
    } else {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    }
  }, [isActive]);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    await loadModel(selectedModel); // Load the selected model
    const detections = await detectObjects(canvas);
    setDetectionResults(detections);
    const tracked = trackObjects(detections); // Track objects across frames
    setTrackedObjects(tracked);
  };

  const handleSwitchCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 1) {
          const currentDeviceId = videoRef.current.srcObject.getVideoTracks()[0].getSettings().deviceId;
          const nextDevice = videoDevices.find(device => device.deviceId !== currentDeviceId);
          if (nextDevice) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: nextDevice.deviceId } });
            videoRef.current.srcObject = stream;
          } else {
            alert('No other camera found.');
          }
        } else {
          alert('Only one camera available.');
        }
      }
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  const handleSaveResults = () => {
    try {
      const results = {
        detectionResults,
        trackedObjects,
        timestamp: new Date().toISOString(),
      };
      const savedResults = JSON.parse(localStorage.getItem("detectionResults")) || [];
      savedResults.push(results);
      localStorage.setItem("detectionResults", JSON.stringify(savedResults));
      alert("Detection results saved!");
    } catch (error) {
      console.error("Error saving detection results:", error);
      alert("Failed to save detection results.");
    }
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
          {isActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
              <Button variant="outline" size="icon" onClick={handleCapture}>
                <Camera className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button variant="primary" onClick={() => setIsActive(true)}>
                Activate Camera
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        {isActive ? (
          <Button variant="outline" size="icon" onClick={() => setIsActive(false)}>
            <PauseCircle className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={() => setIsActive(true)}>
            <Play className="h-6 w-6" />
          </Button>
        )}
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
      <div className="mb-8">
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <Label htmlFor="option1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <Label htmlFor="option2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="option3" />
            <Label htmlFor="option3">Option 3</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Object Detection Model</h2>
        <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="efficientdet" id="efficientdet" />
            <Label htmlFor="efficientdet">EfficientDet</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yolov5" id="yolov5" />
            <Label htmlFor="yolov5">YOLOv5</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ssd_mobilenet" id="ssd_mobilenet" />
            <Label htmlFor="ssd_mobilenet">SSD MobileNet</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/images/new_feature1.jpg" alt="Feature 1" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Explore the first feature of our app. It provides amazing benefits and functionalities that enhance your experience.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 2</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/images/new_feature2.jpg" alt="Feature 2" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Discover the second feature of our app. It offers advanced tools and capabilities to boost your productivity.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 3</CardTitle>
          </CardHeader>
          <CardContent>
            <img src="/images/new_feature3.jpg" alt="Feature 3" className="mx-auto object-cover w-full h-[200px]" />
            <p className="mt-4">
              Learn about the third feature of our app. It provides unique insights and analytics to help you make informed decisions.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center mt-8">
        <Button variant="primary" size="lg">Get Started</Button>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          {/* Settings content goes here */}
          <Button onClick={() => setShowSettingsModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Tutorial</DialogTitle>
          </DialogHeader>
          {/* Help content goes here */}
          <Button onClick={() => setShowHelpModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectDetectionApp;