"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "./social-links";
import { useState } from "react";
import { Smartphone, Download } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-background border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Stories & Guides Section */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 font-sans">
              CONTENT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/stories" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  All Stories
                </Link>
              </li>
              <li>
                <Link href="/stories?category=guides" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Flight Guides
                </Link>
              </li>
              <li>
                <Link href="/stories?category=reviews" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/stories?category=tutorials" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics Section */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 font-sans">
              TOPICS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/stories?category=technology" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/stories?category=safety" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/stories?category=regulations" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Regulations
                </Link>
              </li>
              <li>
                <Link href="/stories?category=photography" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands & Equipment */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 font-sans">
              EQUIPMENT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/reviews/dji" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  DJI
                </Link>
              </li>
              <li>
                <Link href="/reviews/autel" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Autel
                </Link>
              </li>
              <li>
                <Link href="/reviews/skydio" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Skydio
                </Link>
              </li>
              <li>
                <Link href="/reviews/accessories" className="text-foreground hover:text-primary text-sm transition-colors font-sans">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Description & Subscribe */}
          <div className="sm:col-span-2 lg:col-span-6">
            <div className="mb-6">
              <p className="text-gray-600 text-sm leading-relaxed italic mb-4 font-headline">
                Delivering sharp, original, insightful drone journalism 
                about UAV technology and aerial innovations across the globe since 2024.
              </p>
              
                            <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-8 sm:h-9 text-xs sm:text-sm border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xs font-sans"
                  required 
                />
                <Button 
                  variant="default"
                  type="submit" 
                  className="px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm rounded-xs"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-sm mb-6">
              <Link href="/about" className="text-foreground hover:text-primary transition-colors font-sans">
                About Us
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-sans">
                Contact
              </Link>
              <Link href="/careers" className="text-foreground hover:text-primary transition-colors font-sans">
                Careers
              </Link>
              <Link href="/advertise" className="text-foreground hover:text-primary transition-colors font-sans">
                Advertise
              </Link>
              <Link href="/support" className="text-foreground hover:text-primary transition-colors font-sans">
                Help
              </Link>
              <Link href="/community" className="text-foreground hover:text-primary transition-colors font-sans">
                Community
              </Link>
            </div>

            {/* Social & Download */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <p className="text-xs text-foreground font-sans mb-2">FOLLOW US</p>
                <SocialLinks variant="inline" className="gap-3" />
              </div>
              
              
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
              <Link href="/terms" className="hover:text-gray-700 transition-colors uppercase tracking-wider font-sans">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:text-gray-700 transition-colors uppercase tracking-wider font-sans">
                Privacy
              </Link>
            </div>
            
            <div className="text-xs text-gray-400 font-sans">
              © 2024 UAV HELPLINE. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}