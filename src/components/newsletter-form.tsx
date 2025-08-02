"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface NewsletterFormProps {
    outline_button?: boolean;
}

export default function NewsletterForm({ outline_button = true }: NewsletterFormProps) {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(email);
    };
    return (
        <form onSubmit={handleSubscribe} className="flex gap-2 mb-4 h-12">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 max-w-md bg-white h-full text-xs sm:text-sm border-border focus:border-primary focus:ring-primary rounded-xs font-sans"
                  required 
                />
                <Button 
                  variant={outline_button ? "secondary" : "default"}
                  type="submit" 
                  className={`md:text-md font-semibold md:w-1/3 h-full ${outline_button ? "bg-transparent" : ""}`}
                >
                  Subscribe
                </Button>
              </form>
    );
}