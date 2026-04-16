"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminCard, AdminBadge, AdminModal } from "@/components/admin/ui";
import { BlockEditor } from "@/components/admin/editor";
import type { Newsletter } from "@/types/admin";
import type { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";

export default function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState<JSONContent | undefined>();

  // Generate HTML from content for preview
  const previewHtml = useMemo(() => {
    if (!content) return "";
    try {
      return generateHTML(content, [
        StarterKit.configure({ codeBlock: false }),
        Image.configure({ allowBase64: true }),
        Link,
        Youtube,
      ]);
    } catch {
      return "<p>Unable to generate preview</p>";
    }
  }, [content]);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`/api/admin/newsletters/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch newsletter");
        }
        const data = await response.json();
        setNewsletter(data);
        setTitle(data.title);
        setSubject(data.subject);
        setContent(data.content as JSONContent);
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        toast.error("Failed to load newsletter");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletter();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject line is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/newsletters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update newsletter");
      }

      toast.success("Changes saved!");
    } catch (error) {
      console.error("Error updating newsletter:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    setIsSaving(true);

    try {
      // Save first
      await fetch(`/api/admin/newsletters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          content,
          status: "sending",
        }),
      });

      // Then send
      const sendResponse = await fetch(`/api/admin/newsletters/${id}/send`, {
        method: "POST",
      });

      if (!sendResponse.ok) {
        throw new Error("Failed to send newsletter");
      }

      toast.success("Newsletter sent!");
      router.push("/admin/newsletters");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Failed to send newsletter");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/newsletters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete newsletter");
      }

      toast.success("Newsletter deleted");
      router.push("/admin/newsletters");
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      toast.error("Failed to delete newsletter");
    }
  };

  const getStatusVariant = (status: Newsletter["status"]) => {
    switch (status) {
      case "sent":
        return "success";
      case "sending":
        return "warning";
      case "scheduled":
        return "info";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--muted)]">Newsletter not found</p>
      </div>
    );
  }

  const isEditable = newsletter.status === "draft";

  return (
    <div>
      <AdminHeader
        title={isEditable ? "Edit Newsletter" : "View Newsletter"}
        description={
          <div className="flex items-center gap-2">
            <AdminBadge variant={getStatusVariant(newsletter.status)}>
              {newsletter.status}
            </AdminBadge>
            {newsletter.sentAt && (
              <span className="text-sm text-[var(--muted)]">
                Sent on {format(new Date(newsletter.sentAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/newsletters")}
            >
              Back
            </AdminButton>
            {isEditable && (
              <>
                <AdminButton
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  Save Draft
                </AdminButton>
                <AdminButton
                  onClick={handleSend}
                  isLoading={isSaving}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  }
                >
                  Send Now
                </AdminButton>
              </>
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
                label="Internal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., January 2025 Newsletter"
                hint="For your reference only"
                disabled={!isEditable}
              />
            </AdminCard>

            <BlockEditor
              content={content}
              onChange={setContent}
              placeholder="Write your newsletter content..."
              editable={isEditable}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Email Settings
              </h3>
              <div className="space-y-4">
                <AdminInput
                  label="Subject Line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line"
                  hint="What subscribers see in their inbox"
                  disabled={!isEditable}
                />
              </div>
            </AdminCard>

            {newsletter.status === "sent" && (
              <AdminCard>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                  Delivery Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Recipients</span>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {newsletter.recipientCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted)]">Sent at</span>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {newsletter.sentAt
                        ? format(new Date(newsletter.sentAt), "MMM d, yyyy h:mm a")
                        : "—"}
                    </span>
                  </div>
                </div>
              </AdminCard>
            )}

            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Email Preview
              </h3>
              <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)] mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">TC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      Nicholaus.ai
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {subject || "Subject line preview"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Preview of how your email appears in inboxes
                </p>
              </div>
              <AdminButton
                variant="secondary"
                onClick={() => setShowPreviewModal(true)}
                className="w-full"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              >
                View Full Preview
              </AdminButton>
            </AdminCard>
          </div>
        </div>
      </div>

      <AdminModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Newsletter"
        description="Are you sure you want to delete this newsletter? This action cannot be undone."
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
          This will permanently delete the newsletter &quot;{newsletter.title}&quot;.
        </p>
      </AdminModal>

      {/* Email Preview Modal */}
      <AdminModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Email Preview"
        description={subject || "Preview"}
        size="2xl"
        footer={
          <AdminButton variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </AdminButton>
        }
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Email Header */}
          <div className="bg-[var(--background)] rounded-t-lg p-4 border border-[var(--border)] border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">TC</span>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">Nicholaus.ai</p>
                <p className="text-sm text-[var(--muted)]">newsletter@nicholaus.ai</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {subject || "No subject"}
              </p>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-white rounded-b-lg p-6 border border-[var(--border)] border-t-0">
            <div
              className="prose prose-sm max-w-none text-gray-800"
              style={{
                color: "#1f2937",
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
            {!previewHtml && (
              <p className="text-gray-500 italic">No content yet. Start writing in the editor.</p>
            )}
          </div>

          {/* Email Footer */}
          <div className="mt-4 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] text-center">
            <p className="text-xs text-[var(--muted)]">
              You received this email because you subscribed to Nicholaus.ai newsletter.
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              <span className="text-[var(--accent)] cursor-pointer hover:underline">Unsubscribe</span>
              {" | "}
              <span className="text-[var(--accent)] cursor-pointer hover:underline">View in browser</span>
            </p>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
