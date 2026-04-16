"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useState, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { SlashCommand } from "./SlashCommand";

const lowlight = createLowlight(common);

// Convert file to base64 for inline embedding
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface BlockEditorProps {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  editable?: boolean;
}

export function BlockEditor({
  content,
  onChange,
  placeholder = "Start writing, or press '/' for commands...",
  editable = true,
}: BlockEditorProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const files = Array.from(event.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) return;

      // Process each image
      for (const file of imageFiles) {
        try {
          const base64 = await fileToBase64(file);
          // Insert image at current cursor position or end
          if (editor) {
            editor.chain().focus().setImage({ src: base64 }).run();
          }
        } catch (error) {
          console.error("Error processing image:", error);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--accent)] underline",
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "rounded-lg w-full aspect-video",
        },
        inline: false,
        width: 640,
        height: 360,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-[var(--surface)] rounded-lg p-4 font-mono text-sm",
        },
      }),
      SlashCommand,
    ],
    content,
    editable,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px]",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const images = files.filter((file) => file.type.startsWith("image/"));

          if (images.length > 0) {
            event.preventDefault();

            images.forEach(async (image) => {
              try {
                const base64 = await fileToBase64(image);
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                const node = schema.nodes.image.create({ src: base64 });
                const transaction = view.state.tr.insert(
                  coordinates?.pos || view.state.selection.anchor,
                  node
                );
                view.dispatch(transaction);
              } catch (error) {
                console.error("Error inserting image:", error);
              }
            });

            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              fileToBase64(file).then((base64) => {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: base64 });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              });
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[400px] bg-[var(--surface)] rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-[var(--surface-elevated)] rounded w-3/4 mb-4" />
        <div className="h-4 bg-[var(--surface-elevated)] rounded w-full mb-2" />
        <div className="h-4 bg-[var(--surface-elevated)] rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className="relative">
      <EditorToolbar editor={editor} />
      <div
        className={`bg-[var(--surface)] border rounded-xl p-6 mt-2 transition-colors ${
          isDragging
            ? "border-[var(--accent)] border-dashed bg-[var(--accent)]/5"
            : "border-[var(--border)]"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/90 rounded-xl z-10 pointer-events-none">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-[var(--accent)] mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[var(--accent)] font-medium">Drop image here</p>
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--muted);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--foreground);
        }

        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }

        .ProseMirror h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }

        .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #d4d4d4;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .ProseMirror blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--muted);
        }

        .ProseMirror code {
          background: var(--surface-elevated);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: var(--accent);
        }

        .ProseMirror pre {
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .ProseMirror pre code {
          background: transparent;
          padding: 0;
          color: #d4d4d4;
        }

        .ProseMirror img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }

        .ProseMirror a {
          color: var(--accent);
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: var(--accent-hover);
        }

        .ProseMirror strong {
          color: var(--foreground);
          font-weight: 600;
        }

        .ProseMirror em {
          font-style: italic;
        }

        /* Slash command menu styles */
        .slash-command-menu {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .slash-command-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .slash-command-item:hover,
        .slash-command-item.is-selected {
          background: var(--surface-elevated);
        }

        .slash-command-item-icon {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          background: var(--accent)/10;
          color: var(--accent);
        }

        .slash-command-item-title {
          font-weight: 500;
          color: var(--foreground);
          font-size: 0.875rem;
        }

        .slash-command-item-description {
          color: var(--muted);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
