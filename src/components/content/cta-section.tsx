import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  className?: string;
}

export function CTASection({
  title = "Share Your Drone Story",
  description = "Have an amazing UAV experience or innovative drone project? We'd love to feature your story in our community.",
  buttonText = "Submit Your Story",
  buttonAction,
  className
}: CTASectionProps) {
  return (
    <section className={`bg-white py-16 ${className || ''}`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {description}
        </p>
        <Button 
          size="lg" 
          className="font-semibold"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}