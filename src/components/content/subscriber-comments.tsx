"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CommentSlide {
  id: number;
  storyTitle: string;
  storySlug: string;
  comment: string;
  author: string;
  context: string;
}

const commentSlides: CommentSlide[] = [
  {
    id: 1,
    storyTitle: "At India's airports, Adani wants the runway, the lounge, the latte, and the lipstick",
    storySlug: "adani-airports-monopoly",
    comment: "Echoing what's already highlighted below i.e., monopoly sucks from a customer standpoint. Not just from a price standpoint but also customer experience and vibe. These airports will turn into cow sheds for lack of a better parallel.",
    author: "Suresh Nayak",
    context: "Compliance, Coupang"
  },
  {
    id: 2,
    storyTitle: "Why Military Drones Are Getting Smaller and Deadlier",
    storySlug: "military-drones-evolution",
    comment: "The miniaturization trend is fascinating but concerning. We're essentially creating swarms of autonomous weapons that could change warfare forever. The ethical implications need serious discussion before we go too far down this path.",
    author: "Dr. Sarah Chen",
    context: "Defense Tech, MIT"
  },
  {
    id: 3,
    storyTitle: "Commercial Drone Delivery: Reality or Marketing Hype?",
    storySlug: "drone-delivery-reality-check",
    comment: "I've been working in logistics for 15 years and honestly, drone delivery is still solving problems that don't exist for most people. The infrastructure costs alone make it economically unfeasible except in very specific use cases.",
    author: "Mike Rodriguez",
    context: "Supply Chain, Amazon"
  },
  {
    id: 4,
    storyTitle: "How Ukraine Changed Drone Warfare Forever",
    storySlug: "ukraine-drone-warfare",
    comment: "This conflict has shown that consumer-grade drones with simple modifications can be as effective as million-dollar military systems. It's democratized warfare in ways we're only beginning to understand. Terrifying and fascinating.",
    author: "Elena Volkov",
    context: "Military Analysis, RAND"
  }
];

export function SubscriberComments() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % commentSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + commentSlides.length) % commentSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setLastInteraction(Date.now()); // Reset timer when user manually navigates
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % commentSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, lastInteraction]);

  const currentComment = commentSlides[currentSlide];

  return (
    <div className="w-full max-w-sm mx-auto ">
      <Card 
        className="bg-accent rounded-sm overflow-hidden border-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header */}
        <div className="text-center py-1">
          <div className="w-8 h-8 rounded mx-auto mb-2"></div>
          <h3 className="text-lg font-medium font-sans">Top Subscriber Comments</h3>
        </div>

        {/* Content */}
        <div className="md:p-6 p-4 space-y-4">
          {/* Story Title */}
          <h4 className="font-headline font-bold text-xl leading-tight text-secondary">
            {currentComment.storyTitle}
          </h4>

          {/* Comment */}
          <div className="space-y-3">
            <div className="font-sans font-medium text-sm leading-snug">
              {currentComment.comment}
            </div>
            
            {/* Author Attribution */}
            <div className="text-xs italic">
              By {currentComment.author}, {currentComment.context}
            </div>
          </div>

          {/* View in Story Button */}
          <Button 
            variant="secondary" 
            className="w-full bg-transparent"
            onClick={() => {
              // In a real app, this would navigate to the story
              console.log(`Navigate to story: ${currentComment.storySlug}`);
            }}
          >
            View in Story
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 pb-6">
          {commentSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-red-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Card>

      {/* Navigation Controls (Hidden on mobile, can be used for testing) */}
      <div className="hidden mt-4 flex justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          className="px-3"
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          className="px-3"
        >
          →
        </Button>
      </div>
    </div>
  );
}