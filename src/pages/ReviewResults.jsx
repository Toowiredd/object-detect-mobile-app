import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReviewResults = () => {
  const [savedResults, setSavedResults] = useState([]);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem("detectionResults")) || [];
    setSavedResults(results);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Review Detection Results</h1>
        <p className="text-lg text-muted-foreground">
          Here you can review your saved detection results.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedResults.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Result {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-4">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
              <p className="mt-4">Detections: {result.detections.length}</p>
              <p className="mt-4">Tracked Objects: {result.trackedObjects.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewResults;