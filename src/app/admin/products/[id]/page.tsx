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

const PRODUCT_TYPES = [
  { value: "course", label: "Course" },
  { value: "audit", label: "Audit" },
  { value: "template", label: "Template" },
  { value: "ebook", label: "eBook" },
  { value: "consultation", label: "Consultation" },
] as const;

type ProductType = (typeof PRODUCT_TYPES)[number]["value"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const product = useQuery(api.products.getById, {
    id: productId as Id<"products">,
  });
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<ProductType>("course");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (product && !initialized) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description || "");
      setContent(product.content || "");
      setType(product.type as ProductType);
      setPrice(String(product.price));
      setCurrency(product.currency);
      setCoverImageUrl(product.coverImageUrl || "");
      setInitialized(true);
    }
  }, [product, initialized]);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleSave = async (publish?: boolean) => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsSaving(true);

    try {
      await updateProduct({
        id: productId as Id<"products">,
        name,
        slug: slug || generateSlug(name),
        description: description || undefined,
        content: content || undefined,
        type,
        price: priceNum,
        currency: currency || "USD",
        coverImageUrl: coverImageUrl || undefined,
        ...(publish !== undefined ? { published: publish } : {}),
      });

      toast.success(
        publish && !product?.published ? "Product published!" : "Changes saved!"
      );
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnpublish = async () => {
    setIsSaving(true);
    try {
      await updateProduct({
        id: productId as Id<"products">,
        published: false,
      });
      toast.success("Product unpublished");
    } catch (error) {
      console.error("Error unpublishing:", error);
      toast.error("Failed to unpublish");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      await removeProduct({ id: productId as Id<"products"> });
      toast.success("Product deleted");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsSaving(false);
    }
  };

  if (product === undefined) {
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

  if (product === null) {
    return (
      <div>
        <AdminHeader title="Product not found" />
        <div className="p-6 text-center">
          <p className="text-[var(--muted)]">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <AdminButton
            variant="secondary"
            onClick={() => router.push("/admin/products")}
            className="mt-4"
          >
            Back to Products
          </AdminButton>
        </div>
      </div>
    );
  }

  const isPublished = product.published;

  return (
    <div>
      <AdminHeader
        title="Edit Product"
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </AdminButton>
              }
              items={[
                ...(isPublished
                  ? [
                      {
                        label: "View Product",
                        onClick: () =>
                          window.open(`/products/${slug}`, "_blank"),
                        icon: (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        ),
                      },
                      {
                        label: "Unpublish",
                        onClick: handleUnpublish,
                        icon: (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        ),
                      },
                    ]
                  : []),
                {
                  label: "Delete",
                  onClick: handleDelete,
                  icon: (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  ),
                  danger: true,
                },
              ]}
            />
            <AdminButton
              variant="secondary"
              onClick={() => handleSave()}
              isLoading={isSaving}
            >
              Save
            </AdminButton>
            {!isPublished && (
              <AdminButton
                onClick={() => handleSave(true)}
                isLoading={isSaving}
              >
                Publish
              </AdminButton>
            )}
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name..."
                  className="text-xl font-semibold"
                />
                <AdminInput
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="product-url-slug"
                  hint="URL-friendly version of the name"
                />
              </div>
            </AdminCard>

            <AdminCard>
              <AdminTextarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the product..."
                rows={3}
                hint="Shown in product previews and listings"
              />
            </AdminCard>

            <AdminCard>
              <AdminTextarea
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full product description, details, what's included..."
                rows={12}
                hint="Rich content for the product page"
              />
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Product Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Product Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProductType)}
                    className="w-full px-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  >
                    {PRODUCT_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--muted)]/50"
                    />
                  </div>
                </div>

                <AdminInput
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="USD"
                  hint="ISO 4217 currency code"
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
                placeholder="https://..."
                hint="Featured image for the product"
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

            {/* View Product Link */}
            {isPublished && (
              <AdminCard>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                  Preview
                </h3>
                <a
                  href={`/products/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View published product
                </a>
              </AdminCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
