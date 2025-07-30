import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Content utility functions
export function getContentPreview(content: any, maxLength: number = 150): string {
  if (!content) return "Discover the latest in drone technology and UAV innovations...";
  
  try {
    // Extract text from TipTap content
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.content) {
        return node.content.map(extractText).join('');
      }
      return '';
    };
    
    let text = '';
    if (content.type === 'doc' && content.content) {
      text = content.content.map(extractText).join(' ');
    } else {
      text = extractText(content);
    }
    
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  } catch {
    return "Explore comprehensive UAV guides, drone reviews, and aviation insights...";
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateReadingTime(content: any): number {
  const text = getContentPreview(content, 10000); // Get full text
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
