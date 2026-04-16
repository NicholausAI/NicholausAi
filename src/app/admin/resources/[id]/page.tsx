"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminTextarea, AdminCard, AdminModal } from "@/components/admin/ui";
import type { Resource } from "@/types/admin";

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

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [featured, setFeatured] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/admin/resources/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch resource");
        }
        const data = await response.json();
        setResource(data);
        setName(data.name);
        setDescription(data.description || "");
        setUrl(data.url);
        setCategory(data.category);
        setFeatured(data.featured);
        setAffiliateLink(data.affiliateLink);
      } catch (error) {
        console.error("Error fetching resource:", error);
        toast.error("Failed to load resource");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!url.trim()) {
      toast.error("URL is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: "PUT",
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
        throw new Error("Failed to update resource");
      }

      toast.success("Changes saved!");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      toast.success("Resource deleted");
      router.push("/admin/resources");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--muted)]">Resource not found</p>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Edit Resource"
        description={name}
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/resources")}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </AdminButton>
            <AdminButton onClick={handleSave} isLoading={isSaving}>
              Save Changes
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

      <AdminModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDelete}>
              Delete
            </AdminButton>
          </>
        }
      >
        <p className="text-sm text-[var(--muted)]">
          This will permanently delete &quot;{resource.name}&quot;.
        </p>
      </AdminModal>
    </div>
  );
}
