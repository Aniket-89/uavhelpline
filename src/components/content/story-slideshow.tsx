"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DividerLink from "./divider-link";

interface SlideshowStory {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  fullImage: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  content: string;
  stats?: {
    views: string;
    engagement: string;
  };
}

interface StorySlideshow {
  title: string;
  stories: SlideshowStory[];
}

const defaultStories: SlideshowStory[] = [
  {
    id: "1",
    title: "Military Drone Surveillance Reaches New Heights in Border Security Operations",
    category: "Defense Tech",
    thumbnail: "/general-img-landscape.png",
    fullImage: "/general-img-landscape.png",
    excerpt: "Advanced UAV systems are revolutionizing border patrol with AI-powered threat detection and 24/7 monitoring capabilities.",
    author: "Sarah Mitchell",
    publishedAt: "2024-01-15",
    readTime: 8,
    content: "The integration of military-grade surveillance drones along international borders has transformed security operations...",
    stats: {
      views: "2.3k",
      engagement: "89%"
    }
  },
  {
    id: "2", 
    title: "Commercial Drone Delivery Networks Expand to Rural Communities Worldwide",
    category: "Commercial UAV",
    thumbnail: "/general-img-landscape.png",
    fullImage: "/general-img-landscape.png",
    excerpt: "Major logistics companies are deploying autonomous delivery drones to serve remote areas previously unreachable by traditional methods.",
    author: "James Rodriguez",
    publishedAt: "2024-01-12",
    readTime: 6,
    content: "The rapid expansion of drone delivery services is bridging the gap between urban convenience and rural accessibility...",
    stats: {
      views: "1.8k",
      engagement: "76%"
    }
  },
  {
    id: "3",
    title: "AI-Powered Agricultural Drones Boost Crop Yields by 40% in Latest Trials",
    category: "AgTech",
    thumbnail: "/general-img-landscape.png", 
    fullImage: "/general-img-landscape.png",
    excerpt: "Smart farming drones equipped with precision sensors and AI analytics are revolutionizing modern agriculture practices.",
    author: "Dr. Elena Vasquez",
    publishedAt: "2024-01-10",
    readTime: 10,
    content: "Precision agriculture has reached a new milestone with AI-powered drones demonstrating unprecedented crop yield improvements...",
    stats: {
      views: "3.1k",
      engagement: "92%"
    }
  },
  {
    id: "4",
    title: "Drone Racing Championship Sets Speed Records with Next-Gen Racing UAVs", 
    category: "Racing & Sports",
    thumbnail: "/general-img-landscape.png",
    fullImage: "/general-img-landscape.png",
    excerpt: "Professional drone racing reaches new velocities as cutting-edge UAV technology pushes the boundaries of competitive aerial sports.",
    author: "Marcus Thompson",
    publishedAt: "2024-01-08",
    readTime: 5,
    content: "The 2024 World Drone Racing Championship showcased remarkable technological advances in high-speed UAV design...",
    stats: {
      views: "1.5k",
      engagement: "68%"
    }
  },
  {
    id: "5",
    title: "Environmental Monitoring Drones Track Climate Change Impact in Real-Time",
    category: "Environmental",
    thumbnail: "/general-img-landscape.png",
    fullImage: "/general-img-landscape.png", 
    excerpt: "Specialized environmental drones provide crucial data for climate research and conservation efforts across global ecosystems.",
    author: "Dr. Anna Chen",
    publishedAt: "2024-01-05",
    readTime: 12,
    content: "Climate scientists are leveraging advanced drone technology to gather unprecedented environmental data...",
    stats: {
      views: "2.7k",
      engagement: "85%"
    }
  }
];

export default function StorySlideshow({ 
  title = "Featured UAV Stories",
  stories = defaultStories 
}: {
  title?: string;
  stories?: SlideshowStory[];
}) {
  const [selectedStory, setSelectedStory] = useState<SlideshowStory>(stories[0]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <DividerLink href="/news">
          {title}
      </DividerLink>
      
      <div className="grid md:grid-cols-12">
        {/* Left Sidebar - Story Tiles */}
        <div className=" md:col-span-4 h-full rounded-sm">
            <div className="overflow-y-auto grid grid-cols-2 md:grid-cols-1 h-full scrollbar-hide">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className={`cursor-pointer border-none bg-accent transition-all rounded-xs duration-300 p-2 lg:p-6 ${
                    selectedStory.id === story.id 
                      ? 'bg-accent-foreground/70' 
                      : ''
                  }`}
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="flex gap-3 items-center">
                    <div className="relative w-10 h-10 md:w-16 md:h-16 flex-shrink-0">
                      <Image
                        src={story.thumbnail}
                        alt={story.title}
                        fill
                        className="object-cover rounded-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-0">

                      <h4 className={`font-headline font-semibold text-xs leading-tight line-clamp-2 mb-1 `}>
                        {story.title}
                      </h4>
                     
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Right Side - Detailed View */}
        <div className=" md:col-span-8">
          

            {/* Main Image */}
            <div className="relative w-full aspect-[8/5]">
              <Image
                src={selectedStory.fullImage}
                alt={selectedStory.title}
                fill
                className="object-cover"
              />
            </div>

          
        </div>
      </div>
    </div>
  );
}