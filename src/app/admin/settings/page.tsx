"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminInput, AdminTextarea, AdminCard } from "@/components/admin/ui";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [siteName, setSiteName] = useState("Nicholaus.ai");
  const [tagline, setTagline] = useState("Insights from the depths");
  const [heroHeadline, setHeroHeadline] = useState("Insights from the depths");
  const [heroSubtext, setHeroSubtext] = useState(
    "Join fellow cave dwellers for weekly thoughts on coding, trading, and building in the digital age. No fluff, just signal."
  );
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          tagline,
          heroHeadline,
          heroSubtext,
          socialLinks: {
            twitter,
            github,
            linkedin,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Settings"
        description="Configure your site settings"
        actions={
          <AdminButton onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </AdminButton>
        }
      />

      <div className="p-6 space-y-6 max-w-2xl">
        {/* General Settings */}
        <AdminCard>
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
            General
          </h3>
          <div className="space-y-4">
            <AdminInput
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Nicholaus.ai"
            />
            <AdminInput
              label="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A short description of your site"
            />
          </div>
        </AdminCard>

        {/* Homepage Settings */}
        <AdminCard>
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
            Homepage
          </h3>
          <div className="space-y-4">
            <AdminInput
              label="Hero Headline"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              placeholder="Main headline on homepage"
            />
            <AdminTextarea
              label="Hero Subtext"
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
              placeholder="Supporting text below the headline"
              rows={3}
            />
          </div>
        </AdminCard>

        {/* Social Links */}
        <AdminCard>
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
            Social Links
          </h3>
          <div className="space-y-4">
            <AdminInput
              label="Twitter/X"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/username"
              type="url"
            />
            <AdminInput
              label="GitHub"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              type="url"
            />
            <AdminInput
              label="LinkedIn"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              type="url"
            />
          </div>
        </AdminCard>

        {/* Environment Info */}
        <AdminCard>
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
            Configuration Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Email (Resend)</span>
              <span className={`text-sm ${process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? "text-green-500" : "text-yellow-500"}`}>
                {process.env.RESEND_API_KEY ? "Configured" : "Not configured"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Analytics (Umami)</span>
              <span className={`text-sm ${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? "text-green-500" : "text-yellow-500"}`}>
                {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? "Configured" : "Not configured"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--muted)]">CMS (Strapi)</span>
              <span className="text-sm text-yellow-500">
                Using mock data
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Configure these services in your <code className="bg-[var(--surface)] px-1 rounded">.env.local</code> file.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
