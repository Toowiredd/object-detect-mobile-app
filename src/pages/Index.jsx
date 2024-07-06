import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        <p className="text-lg text-muted-foreground">
          Discover the amazing features we have to offer.
        </p>
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
