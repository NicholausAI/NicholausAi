"use client";

import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import tippy, { type Instance } from "tippy.js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";

interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: unknown; range: unknown }) => void;
}

const commands: CommandItem[] = [
  {
    title: "Text",
    description: "Just start writing with plain text",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { run: () => void } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading",
    icon: <span className="text-sm font-bold">H1</span>,
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { setNode: (type: string, attrs: unknown) => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <span className="text-sm font-bold">H2</span>,
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { setNode: (type: string, attrs: unknown) => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <span className="text-sm font-bold">H3</span>,
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { setNode: (type: string, attrs: unknown) => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { toggleBulletList: () => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { toggleOrderedList: () => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { toggleBlockquote: () => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run();
    },
  },
  {
    title: "Code Block",
    description: "Add a code snippet",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { toggleCodeBlock: () => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock()
        .run();
    },
  },
  {
    title: "Divider",
    description: "Add a horizontal divider",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { setHorizontalRule: () => { run: () => void } } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .run();
    },
  },
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    command: ({ editor, range }: { editor: unknown; range: unknown }) => {
      (editor as { chain: () => { focus: () => { deleteRange: (r: unknown) => { run: () => void } } } })
        .chain()
        .focus()
        .deleteRange(range)
        .run();
      const url = window.prompt("Enter image URL:");
      if (url) {
        (editor as { chain: () => { focus: () => { setImage: (opts: { src: string }) => { run: () => void } } } })
          .chain()
          .focus()
          .setImage({ src: url })
          .run();
      }
    },
  },
];

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) {
          command(item);
        }
      },
      [items, command]
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    if (items.length === 0) {
      return null;
    }

    return (
      <div className="slash-command-menu min-w-[280px] max-h-[300px] overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={item.title}
            onClick={() => selectItem(index)}
            className={`slash-command-item w-full ${
              index === selectedIndex ? "is-selected" : ""
            }`}
          >
            <div className="slash-command-item-icon">{item.icon}</div>
            <div>
              <div className="slash-command-item-title">{item.title}</div>
              <div className="slash-command-item-description">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }
);

CommandList.displayName = "CommandList";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: unknown;
          range: unknown;
          props: CommandItem;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return commands.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer<CommandListRef>;
          let popup: Instance;

          return {
            onStart: (props: {
              clientRect: (() => DOMRect | null) | null;
              command: (item: CommandItem) => void;
              items: CommandItem[];
            }) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy(document.body, {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },

            onUpdate(props: {
              clientRect: (() => DOMRect | null) | null;
              items: CommandItem[];
            }) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup.setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },

            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === "Escape") {
                popup.hide();
                return true;
              }

              return component.ref?.onKeyDown(props) ?? false;
            },

            onExit() {
              popup.destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
