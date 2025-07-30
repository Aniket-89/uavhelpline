import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialLinksProps {
  variant?: "footer" | "header" | "inline";
  className?: string;
}

export function SocialLinks({ variant = "footer", className = "" }: SocialLinksProps) {
  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://facebook.com/uavhelpline",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-blue-600"
    },
    {
      name: "Twitter",
      href: "https://twitter.com/uavhelpline",
      icon: <Twitter className="w-5 h-5" />,
      color: "hover:bg-sky-500"
    },
    {
      name: "Instagram",
      href: "https://instagram.com/uavhelpline",
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:bg-pink-600"
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@uavhelpline",
      icon: <Youtube className="w-5 h-5" />,
      color: "hover:bg-red-600"
    }
  ];

  const baseClasses = variant === "footer" 
    ? "w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
    : variant === "inline"
    ? "w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300"
    : "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110";

  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} ${social.color} group`}
          aria-label={`Follow us on ${social.name}`}
          title={`Follow us on ${social.name}`}
        >
          <span className={`transition-transform duration-200 ${variant === "inline" ? "text-gray-600" : ""} ${variant !== "inline" ? "group-hover:scale-110" : ""}`}>
            {social.icon}
          </span>
        </a>
      ))}
    </div>
  );
}