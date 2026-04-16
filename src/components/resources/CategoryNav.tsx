"use client";

import { useState, useEffect } from "react";

interface CategoryNavProps {
  categories: string[];
  resourceCounts: Record<string, number>;
}

export function CategoryNav({ categories, resourceCounts }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section
      setIsSticky(window.scrollY > 400);

      // Find which category is currently in view
      const categoryElements = categories.map((cat) =>
        document.getElementById(cat.toLowerCase().replace(/\s+/g, "-"))
      );

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const el = categoryElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveCategory(categories[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = (category: string) => {
    const id = category.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for sticky header + nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`${
        isSticky ? "sticky top-16" : ""
      } z-30 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 transition-all`}
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => scrollToCategory(category)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/80"
            }`}
          >
            {category}
            <span className="ml-1.5 opacity-70">({resourceCounts[category] || 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
