"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminCard,
  AdminModal,
  AdminInput,
} from "@/components/admin/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterType = "all" | "images" | "documents" | "videos";

interface MediaFile {
  _id: Id<"mediaFiles">;
  storageId: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt?: string;
  _creationTime: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeTypeFilter(filter: FilterType): string | undefined {
  switch (filter) {
    case "images":
      return "image";
    case "documents":
      return "document";
    case "videos":
      return "video";
    default:
      return undefined;
  }
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function fileIconFor(mimeType: string) {
  if (mimeType.startsWith("video/")) {
    return (
      <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  if (mimeType === "application/pdf") {
    return (
      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs config
// ---------------------------------------------------------------------------

const FILTER_TABS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "images", label: "Images" },
  { id: "documents", label: "Documents" },
  { id: "videos", label: "Videos" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MediaLibraryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [altText, setAltText] = useState("");
  const [isSavingAlt, setIsSavingAlt] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Convex queries & mutations
  const files = useQuery(api.media.list, {
    mimeType: mimeTypeFilter(activeFilter),
  });
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveFile = useMutation(api.media.saveFile);
  const updateAlt = useMutation(api.media.updateAlt);
  const removeFile = useMutation(api.media.remove);

  // -------------------------------------------------------------------------
  // Upload
  // -------------------------------------------------------------------------

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const toUpload = Array.from(fileList);
      if (toUpload.length === 0) return;

      setIsUploading(true);
      let successCount = 0;
      let failCount = 0;

      for (const file of toUpload) {
        try {
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!result.ok) throw new Error("Upload failed");

          const { storageId } = await result.json();
          await saveFile({
            storageId,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          failCount++;
        }
      }

      setIsUploading(false);

      if (successCount > 0) {
        toast.success(
          successCount === 1
            ? "File uploaded"
            : `${successCount} files uploaded`
        );
      }
      if (failCount > 0) {
        toast.error(
          failCount === 1
            ? "1 file failed to upload"
            : `${failCount} files failed to upload`
        );
      }
    },
    [generateUploadUrl, saveFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  // -------------------------------------------------------------------------
  // Drag & drop
  // -------------------------------------------------------------------------

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  // -------------------------------------------------------------------------
  // File detail actions
  // -------------------------------------------------------------------------

  const openFileDetail = (file: MediaFile) => {
    setSelectedFile(file);
    setAltText(file.alt || "");
    setShowDeleteConfirm(false);
  };

  const closeFileDetail = () => {
    setSelectedFile(null);
    setAltText("");
    setShowDeleteConfirm(false);
  };

  const handleSaveAlt = async () => {
    if (!selectedFile) return;
    setIsSavingAlt(true);
    try {
      await updateAlt({ id: selectedFile._id, alt: altText });
      toast.success("Alt text updated");
      setSelectedFile((prev) =>
        prev ? { ...prev, alt: altText } : null
      );
    } catch {
      toast.error("Failed to update alt text");
    } finally {
      setIsSavingAlt(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    setIsDeleting(true);
    try {
      await removeFile({ id: selectedFile._id });
      toast.success("File deleted");
      closeFileDetail();
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------

  const isLoading = files === undefined;
  const fileCount = files?.length ?? 0;

  return (
    <div>
      <AdminHeader
        title="Media Library"
        description={
          isLoading
            ? "Loading..."
            : `${fileCount} file${fileCount !== 1 ? "s" : ""}`
        }
        actions={
          <AdminButton
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          >
            Upload Files
          </AdminButton>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="p-6 space-y-6">
        {/* Upload drop zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 p-8
            border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-elevated)]"
            }
          `}
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin h-8 w-8 text-[var(--accent)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-[var(--muted)]">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                <svg className="w-6 h-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {isDragging ? "Drop files here" : "Drag and drop files here"}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  or click to browse from your computer
                </p>
              </div>
            </>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-[var(--border)]">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-medium transition-all relative
                ${
                  activeFilter === tab.id
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {tab.label}
              {activeFilter === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
              )}
            </button>
          ))}
        </div>

        {/* File grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : fileCount === 0 ? (
          <AdminCard>
            <div className="text-center py-16">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No files found
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {activeFilter === "all"
                  ? "Upload your first file to get started."
                  : `No ${activeFilter} found. Try a different filter or upload new files.`}
              </p>
              {activeFilter === "all" && (
                <div className="mt-6">
                  <AdminButton onClick={() => fileInputRef.current?.click()}>
                    Upload Files
                  </AdminButton>
                </div>
              )}
            </div>
          </AdminCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file: MediaFile) => (
              <button
                key={file._id}
                onClick={() => openFileDetail(file)}
                className="group relative aspect-square bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all duration-200 text-left"
              >
                {/* Thumbnail / icon */}
                {isImage(file.mimeType) ? (
                  <img
                    src={file.url}
                    alt={file.alt || file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                    {fileIconFor(file.mimeType)}
                    <span className="text-xs text-[var(--muted)] text-center truncate w-full">
                      {file.filename}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
                  <div className="w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-xs text-white font-medium truncate">
                      {file.filename}
                    </p>
                    <p className="text-[10px] text-white/70">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* File detail modal */}
      <AdminModal
        isOpen={!!selectedFile}
        onClose={closeFileDetail}
        title={selectedFile?.filename ?? ""}
        size="2xl"
      >
        {selectedFile && (
          <div className="space-y-6">
            {/* Preview */}
            <div className="flex items-center justify-center bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl overflow-hidden min-h-[200px] max-h-[400px]">
              {isImage(selectedFile.mimeType) ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.alt || selectedFile.filename}
                  className="max-w-full max-h-[400px] object-contain"
                />
              ) : isVideo(selectedFile.mimeType) ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-w-full max-h-[400px]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  {fileIconFor(selectedFile.mimeType)}
                  <span className="text-sm text-[var(--muted)]">
                    {selectedFile.filename}
                  </span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted)]">Type</span>
                <p className="text-[var(--foreground)] font-medium mt-0.5">
                  {selectedFile.mimeType}
                </p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Size</span>
                <p className="text-[var(--foreground)] font-medium mt-0.5">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Uploaded</span>
                <p className="text-[var(--foreground)] font-medium mt-0.5">
                  {format(new Date(selectedFile._creationTime), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Filename</span>
                <p className="text-[var(--foreground)] font-medium mt-0.5 truncate" title={selectedFile.filename}>
                  {selectedFile.filename}
                </p>
              </div>
            </div>

            {/* Alt text */}
            <div className="space-y-2">
              <AdminInput
                label="Alt Text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this file for accessibility"
              />
              <div className="flex justify-end">
                <AdminButton
                  size="sm"
                  variant="secondary"
                  onClick={handleSaveAlt}
                  isLoading={isSavingAlt}
                  disabled={altText === (selectedFile.alt || "")}
                >
                  Save Alt Text
                </AdminButton>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div>
                {!showDeleteConfirm ? (
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  >
                    Delete
                  </AdminButton>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-400">Are you sure?</span>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={handleDelete}
                      isLoading={isDeleting}
                    >
                      Confirm Delete
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </AdminButton>
                  </div>
                )}
              </div>

              <AdminButton
                variant="secondary"
                size="sm"
                onClick={handleCopyUrl}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                }
              >
                Copy URL
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
