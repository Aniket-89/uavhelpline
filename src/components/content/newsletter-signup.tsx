"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterSignupProps {
  className?: string;
  variant?: "default" | "footer" | "inline";
  showDescription?: boolean;
}

export function NewsletterSignup({ 
  className = "", 
  variant = "default",
  showDescription = true 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setMessage("Successfully subscribed! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const inputClasses = variant === "footer" 
    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
    : "bg-white border-gray-200 focus:border-blue-500";

  const textColor = variant === "footer" ? "text-gray-300" : "text-gray-600";

  return (
    <div className={className}>
      {showDescription && (
        <p className={`mb-4 text-sm ${textColor}`}>
          {variant === "footer" 
            ? "Get the latest drone news and tutorials delivered to your inbox."
            : "Join thousands of drone enthusiasts and get exclusive content, tips, and early access to new guides."
          }
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            disabled={status === "loading"}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 px-3 flex-shrink-0"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {status !== "idle" && (
          <div className={`flex items-center gap-2 text-sm ${
            status === "success" ? "text-green-400" : 
            status === "error" ? "text-red-400" : 
            textColor
          }`}>
            {status === "success" && <CheckCircle className="w-4 h-4" />}
            {status === "error" && <AlertCircle className="w-4 h-4" />}
            <span>{message}</span>
          </div>
        )}
      </form>
      
      {variant !== "footer" && (
        <p className="text-xs text-gray-500 mt-3">
          No spam, unsubscribe at any time. Read our{" "}
          <a href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      )}
    </div>
  );
}