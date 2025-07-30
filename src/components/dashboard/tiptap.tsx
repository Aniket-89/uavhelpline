"use client";
import React, { useState, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Temporarily removing dialog imports to fix build issues
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Type,
  Palette,
  Upload,
  X,
  CheckSquare,
  Minus
} from "lucide-react";
import axios from "axios";

interface MenuBarProps {
  editor: Editor | null;
}

interface TiptapEditorProps {
  onChange?: (content: any) => void;
  initialContent?: any;
  placeholder?: string;
  characterLimit?: number;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload/editor-image', formData);
      const imageUrl = response.data.url;
      
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };



  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    disabled, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode; 
    title?: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className="border-b bg-muted/30 p-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Headings */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Type className="h-4 w-4 mr-1" />
                Text
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? 'bg-accent' : ''}
              >
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
              >
                <Heading1 className="h-4 w-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
              >
                <Heading2 className="h-4 w-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
              >
                <Heading3 className="h-4 w-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Lists */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            <CheckSquare className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Alignment */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Media & Links */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => {
              const url = prompt("Enter the URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => {
              const action = confirm("Upload image file or enter URL?\nOK = Upload file, Cancel = Enter URL");
              if (action) {
                fileInputRef.current?.click();
              } else {
                const url = prompt("Enter image URL:");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }
            }}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  onChange, 
  initialContent,
  placeholder = 'Start writing your amazing content...',
  characterLimit = 10000
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-sm border',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-2',
        },
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({ 
        placeholder,
        showOnlyWhenEditable: true,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({ 
        limit: characterLimit,
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded',
        },
      }),
    ],
    content: initialContent || '<p></p>',
    autofocus: false,
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[300px] p-6 bg-background',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    },
    immediatelyRender: false
  });

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const characterPercentage = (characterCount / characterLimit) * 100;

  return (
    <div className="border rounded-lg shadow-sm bg-background overflow-hidden">
      <MenuBar editor={editor} />
      
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
        
        {/* Character count with progress indicator */}
        <div className="border-t bg-muted/30 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Words: {editor?.storage.characterCount.words() || 0}
            </span>
            <span className="text-muted-foreground">
              Characters: {characterCount}/{characterLimit}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  characterPercentage > 90 
                    ? 'bg-destructive' 
                    : characterPercentage > 75 
                    ? 'bg-orange-500' 
                    : 'bg-primary'
                }`}
                style={{ width: `${Math.min(characterPercentage, 100)}%` }}
              />
            </div>
            {characterPercentage > 90 && (
              <Badge variant="destructive" className="text-xs">
                {characterLimit - characterCount} left
              </Badge>
            )}
          </div>
      </div>
      </div>

      <style jsx global>{`
        .prose-editor .ProseMirror {
          outline: none;
        }
        
        .prose-editor .is-editor-empty:first-child::before {
          color: #9CA3AF;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .prose-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .prose-editor .ProseMirror blockquote {
          border-left: 4px solid #E5E7EB;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #6B7280;
        }
        
        .prose-editor .ProseMirror code {
          background-color: #F3F4F6;
          color: #1F2937;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875em;
        }
        
        .prose-editor .ProseMirror pre {
          background-color: #1F2937;
          color: #F9FAFB;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
        
        .prose-editor .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        
        .prose-editor .ProseMirror mark {
          background-color: #FEF3C7;
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .prose-editor .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        
        .prose-editor .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin: 8px 0;
        }
        
        .prose-editor .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 8px;
          user-select: none;
        }
        
        .prose-editor .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        
        .prose-editor .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .prose-editor .ProseMirror a:hover {
          color: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;