"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminBadge,
  AdminModal,
} from "@/components/admin/ui";
import type { Resource } from "@/types/admin";

const CATEGORIES = [
  "Development",
  "Design",
  "Productivity",
  "Trading",
  "Email & Marketing",
  "Other",
];

interface ResourceFormData {
  name: string;
  description: string;
  url: string;
  category: string;
  featured: boolean;
  affiliateLink: boolean;
}

const emptyForm: ResourceFormData = {
  name: "",
  description: "",
  url: "",
  category: "Development",
  featured: false,
  affiliateLink: false,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);

  // Form state
  const [formData, setFormData] = useState<ResourceFormData>(emptyForm);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/admin/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add resource");

      toast.success("Resource added!");
      setShowAddModal(false);
      setFormData(emptyForm);
      fetchResources();
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingResource || !formData.name.trim() || !formData.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/resources/${editingResource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update resource");

      toast.success("Resource updated!");
      setShowEditModal(false);
      setEditingResource(null);
      setFormData(emptyForm);
      fetchResources();
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingResource) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/resources/${deletingResource.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete resource");

      toast.success("Resource deleted!");
      setShowDeleteModal(false);
      setDeletingResource(null);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      description: resource.description,
      url: resource.url,
      category: resource.category,
      featured: resource.featured,
      affiliateLink: resource.affiliateLink,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (resource: Resource) => {
    setDeletingResource(resource);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  // Group resources by category
  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const resourceFormContent = (
    <div className="space-y-4">
      <AdminInput
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        placeholder="e.g., VS Code"
      />
      <AdminTextarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Brief description of the resource"
        rows={2}
      />
      <AdminInput
        label="URL"
        value={formData.url}
        onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
        placeholder="https://example.com"
        type="url"
      />
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm text-[var(--foreground)]">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.affiliateLink}
            onChange={(e) => setFormData((prev) => ({ ...prev, affiliateLink: e.target.checked }))}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm text-[var(--foreground)]">Affiliate Link</span>
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <AdminHeader
        title="Resources"
        description={`${resources.length} tools and resources`}
        actions={
          <AdminButton
            onClick={openAddModal}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Resource
          </AdminButton>
        }
      />

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-[var(--surface)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No resources yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Add tools and resources to recommend to your readers.
              </p>
              <div className="mt-6">
                <AdminButton onClick={openAddModal}>Add Resource</AdminButton>
              </div>
            </div>
          </AdminCard>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResources).map(([category, categoryResources]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-[var(--muted)] mb-3 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[var(--accent)]" />
                  {category}
                  <span className="text-xs">({categoryResources.length})</span>
                </h3>
                <div className="space-y-2">
                  {categoryResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="group flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/30 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0">
                        <span className="text-[var(--muted)] font-bold text-sm">
                          {resource.name.charAt(0)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--foreground)]">
                            {resource.name}
                          </span>
                          {resource.featured && (
                            <svg className="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          )}
                          {resource.affiliateLink && (
                            <AdminBadge variant="success">Affiliate</AdminBadge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted)] truncate">
                          {resource.description}
                        </p>
                      </div>

                      {/* URL */}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit
                      </a>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(resource)}
                          className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(resource)}
                          className="p-2 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AdminModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Resource"
        description="Add a new tool or resource to recommend"
        size="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleAdd} isLoading={isSaving}>
              Add Resource
            </AdminButton>
          </>
        }
      >
        {resourceFormContent}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingResource(null);
        }}
        title="Edit Resource"
        description={editingResource?.name}
        size="lg"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingResource(null);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleEdit} isLoading={isSaving}>
              Save Changes
            </AdminButton>
          </>
        }
      >
        {resourceFormContent}
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingResource(null);
        }}
        title="Delete Resource"
        description="This action cannot be undone"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingResource(null);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDelete} isLoading={isSaving}>
              Delete
            </AdminButton>
          </>
        }
      >
        <p className="text-sm text-[var(--muted)]">
          Are you sure you want to delete <strong className="text-[var(--foreground)]">{deletingResource?.name}</strong>?
          This will remove it from your resources page.
        </p>
      </AdminModal>
    </div>
  );
}
