"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminCard } from "@/components/admin/ui";
import { BlockEditor } from "@/components/admin/editor";
import type { JSONContent } from "@tiptap/react";

export default function NewNewsletterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState<JSONContent | undefined>();

  const handleSubjectFromTitle = useCallback((text: string) => {
    setTitle(text);
    if (!subject) {
      setSubject(text);
    }
  }, [subject]);

  const handleSave = async (action: "save" | "schedule" | "send") => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject line is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          content,
          status: action === "send" ? "sending" : "draft",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create newsletter");
      }

      const data = await response.json();

      if (action === "send") {
        // Trigger send
        const sendResponse = await fetch(`/api/admin/newsletters/${data.id}/send`, {
          method: "POST",
        });

        if (!sendResponse.ok) {
          toast.error("Newsletter saved but failed to send");
          router.push(`/admin/newsletters/${data.id}`);
          return;
        }

        toast.success("Newsletter sent!");
      } else {
        toast.success("Draft saved!");
      }

      router.push(`/admin/newsletters/${data.id}`);
    } catch (error) {
      console.error("Error creating newsletter:", error);
      toast.error("Failed to save newsletter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="New Newsletter"
        description="Create a new email newsletter"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/newsletters")}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => handleSave("save")}
              isLoading={isLoading}
            >
              Save Draft
            </AdminButton>
            <AdminButton
              onClick={() => handleSave("send")}
              isLoading={isLoading}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              }
            >
              Send Now
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
                label="Internal Title"
                value={title}
                onChange={(e) => handleSubjectFromTitle(e.target.value)}
                placeholder="e.g., January 2025 Newsletter"
                hint="For your reference only, not shown to subscribers"
              />
            </AdminCard>

            <BlockEditor
              content={content}
              onChange={setContent}
              placeholder="Write your newsletter content..."
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
                  hint="What subscribers will see in their inbox"
                />
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Preview
              </h3>
              <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)]">
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
                  Preview of how your email will appear in inboxes
                </p>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Sending Options
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSave("send")}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">Send Immediately</p>
                    <p className="text-xs text-[var(--muted)]">Send to all subscribers now</p>
                  </div>
                </button>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
