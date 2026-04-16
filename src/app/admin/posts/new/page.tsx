"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminTextarea, AdminCard } from "@/components/admin/ui";
import { BlockEditor } from "@/components/admin/editor";
import type { JSONContent } from "@tiptap/react";

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<JSONContent | undefined>();
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Id<"categories">[]>([]);
  const [selectedTags, setSelectedTags] = useState<Id<"tags">[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const categories = useQuery(api.categories.list);
  const tags = useQuery(api.tags.list);
  const createPost = useMutation(api.posts.create);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const toggleCategory = (id: Id<"categories">) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleTag = (id: Id<"tags">) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSave = async (publish = false) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);

    try {
      const id = await createPost({
        title,
        slug: slug || generateSlug(title),
        content: "",
        blockContent: content,
        excerpt: excerpt || undefined,
        published: publish,
        publishedAt: publish ? Date.now() : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
        coverImageUrl: coverImageUrl || undefined,
      });

      toast.success(publish ? "Post published!" : "Draft saved!");
      router.push(`/admin/posts/${id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="New Post"
        description="Create a new blog post"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/posts")}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => handleSave(false)}
              isLoading={isLoading}
            >
              Save Draft
            </AdminButton>
            <AdminButton onClick={() => handleSave(true)} isLoading={isLoading}>
              Publish
            </AdminButton>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <AdminInput
                label="Title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className="text-xl font-semibold"
              />
            </AdminCard>

            <BlockEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your post..."
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Post Settings
              </h3>
              <div className="space-y-4">
                <AdminInput
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  hint="URL-friendly version of the title"
                />
                <AdminTextarea
                  label="Excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                  hint="Shown in post previews and SEO"
                />
              </div>
            </AdminCard>

            {/* Cover Image */}
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Cover Image
              </h3>
              <AdminInput
                label="Image URL"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... or pick from media library"
                hint="Featured image for the post"
              />
              {coverImageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[var(--border)]">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </AdminCard>

            {/* Categories */}
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Categories
              </h3>
              {categories === undefined ? (
                <div className="animate-pulse h-8 bg-[var(--surface-elevated)] rounded" />
              ) : categories.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No categories yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => toggleCategory(cat._id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        selectedCategories.includes(cat._id)
                          ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]"
                          : "bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </AdminCard>

            {/* Tags */}
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Tags
              </h3>
              {tags === undefined ? (
                <div className="animate-pulse h-8 bg-[var(--surface-elevated)] rounded" />
              ) : tags.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No tags yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => toggleTag(tag._id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        selectedTags.includes(tag._id)
                          ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]"
                          : "bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                SEO Settings
              </h3>
              <div className="space-y-4">
                <AdminInput
                  label="SEO Title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom title for search engines"
                  hint="Leave blank to use post title"
                />
                <AdminTextarea
                  label="Meta Description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Description for search engines..."
                  rows={3}
                  hint="Leave blank to use excerpt"
                />
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
