"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/types";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <h2 className="font-bold text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
        On this page
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={`
                block text-sm py-1.5 transition-all border-l-2
                ${
                  activeId === item.id
                    ? "text-[var(--accent)] border-[var(--accent)] pl-3 font-medium"
                    : "text-[var(--muted)] border-transparent pl-3 hover:text-[var(--foreground)] hover:border-[var(--border)]"
                }
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
