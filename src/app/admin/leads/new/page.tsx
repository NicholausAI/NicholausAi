"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminCard,
} from "@/components/admin/ui";

const FIELD_TYPES = ["text", "email", "phone", "textarea", "select"] as const;
type FieldType = (typeof FIELD_TYPES)[number];

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export default function NewLeadMagnetPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [thankYouMsg, setThankYouMsg] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);

  // Inline add field state
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState("");

  const createLeadMagnet = useMutation(api.leadMagnets.create);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const addField = () => {
    if (!newFieldLabel.trim()) {
      toast.error("Field label is required");
      return;
    }

    const field: FormField = {
      id: crypto.randomUUID(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      ...(newFieldType === "select" && newFieldOptions.trim()
        ? { options: newFieldOptions.split(",").map((o) => o.trim()).filter(Boolean) }
        : {}),
    };

    setFormFields((prev) => [...prev, field]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
    setNewFieldOptions("");
    setShowAddField(false);
  };

  const removeField = (id: string) => {
    setFormFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...formFields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFormFields(newFields);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formFields.length === 0) {
      toast.error("Add at least one form field");
      return;
    }

    setIsLoading(true);

    try {
      const id = await createLeadMagnet({
        name,
        slug: slug || generateSlug(name),
        description: description || undefined,
        fileUrl: fileUrl || undefined,
        formFields,
        thankYouMsg: thankYouMsg || undefined,
        redirectUrl: redirectUrl || undefined,
      });

      toast.success("Lead magnet created!");
      router.push(`/admin/leads/${id}`);
    } catch (error) {
      console.error("Error creating lead magnet:", error);
      toast.error("Failed to create lead magnet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="New Lead Magnet"
        description="Create a new lead capture form"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/leads")}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} isLoading={isLoading}>
              Save Lead Magnet
            </AdminButton>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="space-y-4">
                <AdminInput
                  label="Name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Free SEO Checklist"
                />
                <AdminInput
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="free-seo-checklist"
                  hint="URL-friendly identifier"
                />
                <AdminTextarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this lead magnet..."
                  rows={3}
                />
              </div>
            </AdminCard>

            {/* Form Fields Builder */}
            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[var(--foreground)]">
                  Form Fields
                </h3>
                <AdminButton
                  variant="secondary"
                  onClick={() => setShowAddField(true)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Add Field
                </AdminButton>
              </div>

              {formFields.length === 0 && !showAddField && (
                <p className="text-sm text-[var(--muted)] text-center py-8">
                  No form fields yet. Add fields to build your lead capture form.
                </p>
              )}

              {formFields.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg"
                    >
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
                          className="p-0.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveField(index, "down")}
                          disabled={index === formFields.length - 1}
                          className="p-0.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Field info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[var(--foreground)]">
                            {field.label}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                              required
                            </span>
                          )}
                        </div>
                        {field.type === "select" && field.options && (
                          <p className="text-xs text-[var(--muted)] mt-1">
                            Options: {field.options.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeField(field.id)}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Add Field Row */}
              {showAddField && (
                <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--accent)]/30 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput
                      label="Field Label"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="e.g., Full Name"
                    />
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Field Type
                      </label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                        className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                      >
                        {FIELD_TYPES.map((ft) => (
                          <option key={ft} value={ft}>
                            {ft.charAt(0).toUpperCase() + ft.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {newFieldType === "select" && (
                    <AdminInput
                      label="Options (comma-separated)"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      placeholder="e.g., Option A, Option B, Option C"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span className="text-sm text-[var(--foreground)]">Required</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <AdminButton
                        variant="secondary"
                        onClick={() => {
                          setShowAddField(false);
                          setNewFieldLabel("");
                          setNewFieldType("text");
                          setNewFieldRequired(false);
                          setNewFieldOptions("");
                        }}
                      >
                        Cancel
                      </AdminButton>
                      <AdminButton onClick={addField}>
                        Add Field
                      </AdminButton>
                    </div>
                  </div>
                </div>
              )}
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Lead Magnet Asset
              </h3>
              <AdminInput
                label="Downloadable File URL"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
                hint="URL to the file users receive after submitting"
              />
            </AdminCard>

            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                After Submission
              </h3>
              <div className="space-y-4">
                <AdminTextarea
                  label="Thank You Message"
                  value={thankYouMsg}
                  onChange={(e) => setThankYouMsg(e.target.value)}
                  placeholder="Thanks for downloading! Check your email..."
                  rows={3}
                />
                <AdminInput
                  label="Redirect URL"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://..."
                  hint="Redirect users here after form submission"
                />
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
