"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminCard,
  AdminModal,
  AdminInput,
  AdminTabs,
  AdminBadge,
} from "@/components/admin/ui";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab() {
  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const removeCategory = useMutation(api.categories.remove);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    _id: string;
    name: string;
    slug: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setName("");
    setSlug("");
    setIsCreateOpen(true);
  };

  const openEdit = (category: { _id: string; name: string; slug: string }) => {
    setName(category.name);
    setSlug(category.slug);
    setEditingCategory(category);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingCategory(null);
    setName("");
    setSlug("");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) {
      setSlug(generateSlug(value));
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      await createCategory({ name: name.trim(), slug: slug.trim() || generateSlug(name) });
      toast.success("Category created");
      closeModals();
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      await updateCategory({
        id: editingCategory._id as never,
        name: name.trim(),
        slug: slug.trim(),
      });
      toast.success("Category updated");
      closeModals();
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeCategory({ id: id as never });
      toast.success("Category deleted");
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (categories === undefined) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-[var(--surface)] border border-[var(--border)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--muted)]">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <AdminButton
          onClick={openCreate}
          size="sm"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Category
        </AdminButton>
      </div>

      {categories.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
              No categories yet
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Create your first category to organize your posts.
            </p>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <AdminCard key={category._id} padding="none">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      /{category.slug}
                      <span className="mx-2 opacity-40">·</span>
                      {format(new Date(category._creationTime), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(category)}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    }
                  />
                  {deletingId === category._id ? (
                    <div className="flex items-center gap-1.5">
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        Confirm
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(null)}
                      >
                        Cancel
                      </AdminButton>
                    </div>
                  ) : (
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(category._id)}
                      icon={
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      }
                    />
                  )}
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={closeModals}
        title="Add Category"
        description="Create a new category to organize your content."
        footer={
          <>
            <AdminButton variant="secondary" onClick={closeModals}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleCreate} isLoading={isSaving}>
              Create Category
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput
            label="Name"
            placeholder="e.g. Technology"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
          />
          <AdminInput
            label="Slug"
            placeholder="e.g. technology"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            hint="Auto-generated from name. Edit to customize."
          />
        </div>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editingCategory}
        onClose={closeModals}
        title="Edit Category"
        description="Update the category name or slug."
        footer={
          <>
            <AdminButton variant="secondary" onClick={closeModals}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleUpdate} isLoading={isSaving}>
              Save Changes
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput
            label="Name"
            placeholder="e.g. Technology"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <AdminInput
            label="Slug"
            placeholder="e.g. technology"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </AdminModal>
    </>
  );
}

// ─── Tags Tab ─────────────────────────────────────────────────────────────────

function TagsTab() {
  const tags = useQuery(api.tags.list);
  const createTag = useMutation(api.tags.create);
  const removeTag = useMutation(api.tags.remove);

  const [newTagName, setNewTagName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = async () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;

    setIsAdding(true);
    try {
      await createTag({ name: trimmed, slug: generateSlug(trimmed) });
      toast.success("Tag created");
      setNewTagName("");
    } catch (error) {
      toast.error("Failed to create tag");
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = async (id: string) => {
    try {
      await removeTag({ id: id as never });
      toast.success("Tag deleted");
    } catch (error) {
      toast.error("Failed to delete tag");
    }
  };

  if (tags === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add Tag Input */}
      <div className="flex items-end gap-3 mb-6">
        <div className="flex-1">
          <AdminInput
            label="Add a new tag"
            placeholder="Type a tag name and press Enter"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAdding}
          />
        </div>
        <AdminButton onClick={handleAddTag} isLoading={isAdding} size="md">
          Add
        </AdminButton>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        {tags.length} {tags.length === 1 ? "tag" : "tags"}
      </p>

      {tags.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
              No tags yet
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Add your first tag to start labeling your content.
            </p>
          </div>
        </AdminCard>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="
                group inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-full text-sm font-medium
                bg-[var(--surface-elevated)] text-[var(--foreground)]
                border border-[var(--border)]
                transition-all duration-150
                hover:border-[var(--accent)]/40
              "
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag._id)}
                className="
                  ml-0.5 p-0.5 rounded-full
                  text-[var(--muted)] hover:text-red-400
                  hover:bg-red-500/10
                  opacity-0 group-hover:opacity-100
                  transition-all duration-150
                "
                aria-label={`Remove ${tag.name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriesAndTagsPage() {
  return (
    <div>
      <AdminHeader
        title="Categories & Tags"
        description="Organize your content with categories and tags"
      />

      <div className="p-6">
        <AdminCard>
          <AdminTabs
            tabs={[
              {
                id: "categories",
                label: "Categories",
                content: <CategoriesTab />,
              },
              {
                id: "tags",
                label: "Tags",
                content: <TagsTab />,
              },
            ]}
            defaultTab="categories"
          />
        </AdminCard>
      </div>
    </div>
  );
}
