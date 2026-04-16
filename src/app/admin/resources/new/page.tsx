"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminTextarea, AdminCard } from "@/components/admin/ui";

const categories = [
  "Development",
  "Trading",
  "Productivity",
  "Design",
  "Marketing",
  "AI & Automation",
  "Books",
  "Courses",
  "Other",
];

export default function NewResourcePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [featured, setFeatured] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!url.trim()) {
      toast.error("URL is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          url,
          category,
          featured,
          affiliateLink,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      toast.success("Resource added!");
      router.push("/admin/resources");
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to add resource");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Add Resource"
        description="Add a new recommended tool or resource"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/resources")}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} isLoading={isLoading}>
              Save Resource
            </AdminButton>
          </div>
        }
      />

      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <AdminCard>
            <div className="space-y-4">
              <AdminInput
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Figma, VS Code, TradingView"
              />
              <AdminTextarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this resource..."
                rows={3}
              />
              <AdminInput
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Featured
                  </span>
                  <p className="text-xs text-[var(--muted)]">
                    Show this resource prominently at the top
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    Affiliate Link
                  </span>
                  <p className="text-xs text-[var(--muted)]">
                    Mark as affiliate/referral link (for disclosure)
                  </p>
                </div>
              </label>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
