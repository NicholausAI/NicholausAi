import type { JSONContent } from "@tiptap/react";

export type { JSONContent };

export interface EditorBlock {
  type: string;
  content?: string;
  attrs?: Record<string, unknown>;
}

export interface BlockMenuCommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: () => void;
}
