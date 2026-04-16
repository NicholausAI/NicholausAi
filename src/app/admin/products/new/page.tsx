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

const PRODUCT_TYPES = [
  { value: "course", label: "Course" },
  { value: "audit", label: "Audit" },
  { value: "template", label: "Template" },
  { value: "ebook", label: "eBook" },
  { value: "consultation", label: "Consultation" },
] as const;

type ProductType = (typeof PRODUCT_TYPES)[number]["value"];

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<ProductType>("course");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const createProduct = useMutation(api.products.create);

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

  const handleSave = async (publish = false) => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsLoading(true);

    try {
      const id = await createProduct({
        name,
        slug: slug || generateSlug(name),
        description: description || undefined,
        content: content || undefined,
        type,
        price: priceNum,
        currency: currency || "USD",
        coverImageUrl: coverImageUrl || undefined,
        published: publish,
      });

      toast.success(publish ? "Product published!" : "Draft saved!");
      router.push(`/admin/products/${id}`);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="New Product"
        description="Create a new digital product"
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => router.push("/admin/products")}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="space-y-4">
                <AdminInput
                  label="Name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
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

            {/* Publish Info */}
            <AdminCard>
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Publishing
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Use &quot;Save Draft&quot; to save without publishing, or
                &quot;Publish&quot; to make this product visible on your site
                immediately.
              </p>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
