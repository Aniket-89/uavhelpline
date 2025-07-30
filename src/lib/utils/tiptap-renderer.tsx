/**
 * TipTap Content Renderer
 * Converts TipTap JSON content to HTML for display in preview/published posts
 */
import React from 'react';

export interface TipTapNode {
  type: string;
  text?: string;
  content?: TipTapNode[];
  attrs?: Record<string, any>;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export const renderTipTapContent = (content: any): string => {
  if (!content) return '<p>No content available</p>';

  const renderNode = (node: TipTapNode): string => {
    if (node.type === 'text') {
      let text = node.text || '';
      
      if (node.marks) {
        node.marks.forEach((mark) => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`;
              break;
            case 'italic':
              text = `<em>${text}</em>`;
              break;
            case 'underline':
              text = `<u>${text}</u>`;
              break;
            case 'strike':
              text = `<s>${text}</s>`;
              break;
            case 'code':
              text = `<code>${text}</code>`;
              break;
            case 'link':
              const href = mark.attrs?.href || '#';
              const target = mark.attrs?.target || '_blank';
              text = `<a href="${href}" target="${target}">${text}</a>`;
              break;
            case 'highlight':
              const color = mark.attrs?.color || 'var(--post-content-highlight)';
              text = `<mark style="background-color: ${color};">${text}</mark>`;
              break;
            case 'textStyle':
              if (mark.attrs?.color) {
                text = `<span style="color: ${mark.attrs.color};">${text}</span>`;
              }
              if (mark.attrs?.fontFamily) {
                text = `<span style="font-family: ${mark.attrs.fontFamily};">${text}</span>`;
              }
              break;
          }
        });
      }
      return text;
    }

    // Handle image nodes (they don't have content)
    if (node.type === 'image') {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      const title = node.attrs?.title || '';
      return `<img src="${src}" alt="${alt}" title="${title}" loading="lazy" />`;
    }

    // Handle horizontal rule (no content)
    if (node.type === 'horizontalRule') {
      return '<hr />';
    }

    // Handle hard break (no content)
    if (node.type === 'hardBreak') {
      return '<br />';
    }

    if (node.content) {
      const contentText = node.content.map(renderNode).join('');
      
      switch (node.type) {
        case 'paragraph':
          return `<p>${contentText}</p>`;
        case 'heading':
          const level = node.attrs?.level || 1;
          return `<h${level}>${contentText}</h${level}>`;
        case 'bulletList':
          return `<ul>${contentText}</ul>`;
        case 'orderedList':
          return `<ol>${contentText}</ol>`;
        case 'listItem':
          return `<li>${contentText}</li>`;
        case 'codeBlock':
          const language = node.attrs?.language || '';
          return `<pre><code class="language-${language}">${contentText}</code></pre>`;
        case 'blockquote':
          return `<blockquote>${contentText}</blockquote>`;
        case 'taskList':
          return `<ul class="task-list">${contentText}</ul>`;
        case 'taskItem':
          const checked = node.attrs?.checked ? 'checked' : '';
          return `<li>
            <input type="checkbox" ${checked} disabled />
            <span ${checked ? 'class="completed"' : ''}>${contentText}</span>
          </li>`;
        case 'table':
          return `<div class="table-container"><table>${contentText}</table></div>`;
        case 'tableRow':
          return `<tr>${contentText}</tr>`;
        case 'tableCell':
          return `<td>${contentText}</td>`;
        case 'tableHeader':
          return `<th>${contentText}</th>`;
        default:
          return contentText;
      }
    }

    return '';
  };

  try {
    // Handle TipTap document structure
    if (content.type === 'doc' && content.content) {
      return content.content.map(renderNode).join('');
    }
    
    // Handle single node or array
    if (Array.isArray(content)) {
      return content.map(renderNode).join('');
    }
    
    return renderNode(content);
  } catch (error) {
    console.error('Error rendering TipTap content:', error);
    return '<p class="text-red-500">Error rendering content</p>';
  }
};

/**
 * React component wrapper for TipTap content
 */
interface TipTapContentProps {
  content: any;
  className?: string;
}

export const TipTapContent: React.FC<TipTapContentProps> = ({ content, className = "" }) => {
  const htmlContent = renderTipTapContent(content);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
      className={`post-content ${className}`}
    />
  );
};