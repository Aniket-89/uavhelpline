import { Button } from "@/components/ui/button";
import NewsletterForm from "../newsletter-form";
import Image from "next/image";

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
    <section className={`bg-popover max-w-6xl rounded-sm my-12 mx-auto py-8 lg:py-16 ${className || ''}`}>
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto px-6">
        <div className="">

        <h2 className="text-2xl font-semibold font-sans text-primary mb-4">
          {title}
        </h2>
        <p className="text-base font-sans text-popover-foreground mb-8">
          {description ? description : ''}
        </p>
        <NewsletterForm />
        </div>
        <div className="flex justify-center items-center">
          <img src="https://cdn.pixabay.com/photo/2016/11/29/02/07/drone-1866742_1280.jpg" alt="CTA Image" width={320} height={240}  className="aspect-[16/9] rounded-xs" />
        </div>
      </div>
    </section>
  );
}