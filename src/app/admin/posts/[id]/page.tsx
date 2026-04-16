"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminCard,
  AdminBadge,
  AdminDropdown,
} from "@/components/admin/ui";
import { BlockEditor } from "@/components/admin/editor";
import type { JSONContent } from "@tiptap/react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const post = useQuery(api.posts.getById, { id: postId as Id<"posts"> });
  const categories = useQuery(api.categories.list);
  const tags = useQuery(api.tags.list);
  const updatePost = useMutation(api.posts.update);
  const removePost = useMutation(api.posts.remove);

  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<JSONContent | undefined>();
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Id<"categories">[]>([]);
  const [selectedTags, setSelectedTags] = useState<Id<"tags">[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (post && !initialized) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setContent(post.blockContent as JSONContent | undefined);
      setSeoTitle(post.seoTitle || "");
      setSeoDescription(post.seoDescription || "");
      setSelectedCategories(post.categoryIds || []);
      setSelectedTags(post.tagIds || []);
      setCoverImageUrl(post.coverImageUrl || "");
      setInitialized(true);
    }
  }, [post, initialized]);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

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

    setIsSaving(true);

    try {
      await updatePost({
        id: postId as Id<"posts">,
        title,
        slug: slug || generateSlug(title),
        blockContent: content,
        excerpt: excerpt || undefined,
        published: publish ? true : post?.published,
        publishedAt: publish && !post?.published ? Date.now() : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        categoryIds: selectedCategories,
        tagIds: selectedTags,
        coverImageUrl: coverImageUrl || undefined,
      });

      toast.success(publish && !post?.published ? "Post published!" : "Changes saved!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnpublish = async () => {
    setIsSaving(true);
    try {
      await updatePost({
        id: postId as Id<"posts">,
        published: false,
      });
      toast.success("Post unpublished");
    } catch (error) {
      console.error("Error unpublishing:", error);
      toast.error("Failed to unpublish");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      return;
    }

    setIsSaving(true);
    try {
      await removePost({ id: postId as Id<"posts"> });
      toast.success("Post deleted");
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsSaving(false);
    }
  };

  if (post === undefined) {
    return (
      <div>
        <AdminHeader title="Loading..." />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-[var(--surface)] rounded-xl" />
            <div className="h-96 bg-[var(--surface)] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div>
        <AdminHeader title="Post not found" />
        <div className="p-6 text-center">
          <p className="text-[var(--muted)]">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <AdminButton
            variant="secondary"
            onClick={() => router.push("/admin/posts")}
            className="mt-4"
          >
            Back to Posts
          </AdminButton>
        </div>
      </div>
    );
  }

  const isPublished = post.published;

  return (
    <div>
      <AdminHeader
        title="Edit Post"
        description={
          <div className="flex items-center gap-2">
            <AdminBadge variant={isPublished ? "success" : "default"}>
              {isPublished ? "Published" : "Draft"}
            </AdminBadge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <AdminDropdown
              trigger={
                <AdminButton variant="ghost">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </AdminButton>
              }
              items={[
                ...(isPublished
                  ? [
                      {
                        label: "Unpublish",
                        onClick: handleUnpublish,
                        icon: (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ),
                      },
                    ]
                  : []),
                {
                  label: "Delete",
                  onClick: handleDelete,
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ),
                  danger: true,
                },
              ]}
            />
            <AdminButton
              variant="secondary"
              onClick={() => handleSave(false)}
              isLoading={isSaving}
            >
              Save
            </AdminButton>
            {!isPublished && (
              <AdminButton onClick={() => handleSave(true)} isLoading={isSaving}>
                Publish
              </AdminButton>
            )}
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
                onChange={(e) => setTitle(e.target.value)}
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

            {isPublished && (
              <AdminCard>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                  Preview
                </h3>
                <a
                  href={`/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View published post
                </a>
              </AdminCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
