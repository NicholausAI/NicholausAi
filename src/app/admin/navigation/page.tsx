"use client";

import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminCard,
  AdminModal,
  AdminInput,
  AdminTabs,
} from "@/components/admin/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavChild {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  order: number;
  children?: NavChild[];
}

type MenuName = "main" | "footer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return crypto.randomUUID();
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function reindex<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, order: i }));
}

// ---------------------------------------------------------------------------
// Icons (inline SVG to avoid external deps)
// ---------------------------------------------------------------------------

function ChevronUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function PlusChildIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-elevated)] mb-4">
        <svg className="w-6 h-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <p className="text-sm text-[var(--muted)] mb-4">
        No navigation items yet. Add your first link to get started.
      </p>
      <AdminButton size="sm" onClick={onAdd} icon={<PlusIcon />}>
        Add Item
      </AdminButton>
    </div>
  );
}

function NavItemRow({
  item,
  index,
  total,
  isChild,
  parentIndex,
  childTotal,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onAddChild,
}: {
  item: NavItem | NavChild;
  index: number;
  total: number;
  isChild?: boolean;
  parentIndex?: number;
  childTotal?: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild?: () => void;
}) {
  return (
    <div
      className={`
        group flex items-center gap-3 px-4 py-3 transition-colors
        hover:bg-[var(--surface-elevated)]/50
        ${isChild ? "pl-12 border-l-2 border-[var(--border)] ml-6" : ""}
      `}
    >
      {/* Ordering arrows */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-0.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          title="Move up"
        >
          <ChevronUpIcon />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-0.5 rounded text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          title="Move down"
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">
          {item.label}
        </p>
        <p className="text-xs text-[var(--muted)] truncate">{item.url}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isChild && onAddChild && (
          <button
            onClick={onAddChild}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-colors"
            title="Add child item"
          >
            <PlusChildIcon />
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-colors"
          title="Edit"
        >
          <PencilIcon />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function NavPreview({ items, menuName }: { items: NavItem[]; menuName: MenuName }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)] italic py-4 text-center">
        Nothing to preview yet.
      </p>
    );
  }

  if (menuName === "footer") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 py-4 justify-center">
        {sortByOrder(items).map((item) => (
          <div key={item.id} className="flex flex-col items-start gap-1">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {item.label}
            </span>
            {item.children && item.children.length > 0 && (
              <div className="flex flex-col gap-0.5 pl-0">
                {sortByOrder(item.children).map((child) => (
                  <span key={child.id} className="text-xs text-[var(--muted)]">
                    {child.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 py-4 px-4 overflow-x-auto">
      {sortByOrder(items).map((item) => (
        <div key={item.id} className="relative group/preview shrink-0">
          <span className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] cursor-default transition-colors">
            {item.label}
          </span>
          {item.children && item.children.length > 0 && (
            <div className="absolute top-full left-0 mt-2 py-2 px-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none min-w-[140px] z-10">
              {sortByOrder(item.children).map((child) => (
                <div
                  key={child.id}
                  className="px-3 py-1.5 text-xs text-[var(--muted)] rounded"
                >
                  {child.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu Editor (one per tab)
// ---------------------------------------------------------------------------

function MenuEditor({
  menuName,
  items,
  onChange,
}: {
  menuName: MenuName;
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    parentIndex?: number;
    childIndex?: number;
  } | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formUrl, setFormUrl] = useState("");

  // Whether modal is for adding a child
  const [addChildParentIndex, setAddChildParentIndex] = useState<number | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    parentIndex: number;
    childIndex?: number;
  } | null>(null);

  const sorted = useMemo(() => sortByOrder(items), [items]);

  // ---- Modal helpers ----

  function openAddModal() {
    setEditTarget(null);
    setAddChildParentIndex(null);
    setFormLabel("");
    setFormUrl("");
    setModalOpen(true);
  }

  function openAddChildModal(parentIdx: number) {
    setEditTarget(null);
    setAddChildParentIndex(parentIdx);
    setFormLabel("");
    setFormUrl("");
    setModalOpen(true);
  }

  function openEditModal(parentIdx: number, childIdx?: number) {
    const parent = sorted[parentIdx];
    if (childIdx !== undefined) {
      const child = sortByOrder(parent.children || [])[childIdx];
      setFormLabel(child.label);
      setFormUrl(child.url);
    } else {
      setFormLabel(parent.label);
      setFormUrl(parent.url);
    }
    setEditTarget({ parentIndex: parentIdx, childIndex: childIdx });
    setAddChildParentIndex(null);
    setModalOpen(true);
  }

  function handleModalSubmit() {
    const label = formLabel.trim();
    const url = formUrl.trim();
    if (!label || !url) {
      toast.error("Label and URL are required");
      return;
    }

    let updated = [...sorted];

    if (editTarget) {
      // Editing existing
      const { parentIndex, childIndex } = editTarget;
      if (childIndex !== undefined) {
        const children = sortByOrder(updated[parentIndex!].children || []);
        children[childIndex] = { ...children[childIndex], label, url };
        updated[parentIndex!] = { ...updated[parentIndex!], children: reindex(children) };
      } else {
        updated[parentIndex!] = { ...updated[parentIndex!], label, url };
      }
    } else if (addChildParentIndex !== null) {
      // Adding child
      const parent = updated[addChildParentIndex];
      const children = sortByOrder(parent.children || []);
      children.push({ id: generateId(), label, url, order: children.length });
      updated[addChildParentIndex] = { ...parent, children: reindex(children) };
    } else {
      // Adding top-level item
      updated.push({
        id: generateId(),
        label,
        url,
        order: updated.length,
        children: [],
      });
    }

    onChange(reindex(updated));
    setModalOpen(false);
  }

  // ---- Reorder helpers ----

  function moveItem(index: number, direction: -1 | 1) {
    const arr = [...sorted];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(reindex(arr));
  }

  function moveChild(parentIdx: number, childIdx: number, direction: -1 | 1) {
    const updated = [...sorted];
    const children = sortByOrder(updated[parentIdx].children || []);
    const target = childIdx + direction;
    if (target < 0 || target >= children.length) return;
    [children[childIdx], children[target]] = [children[target], children[childIdx]];
    updated[parentIdx] = { ...updated[parentIdx], children: reindex(children) };
    onChange(reindex(updated));
  }

  // ---- Delete helpers ----

  function confirmDelete(parentIdx: number, childIdx?: number) {
    setDeleteTarget({ parentIndex: parentIdx, childIndex: childIdx });
  }

  function executeDelete() {
    if (!deleteTarget) return;
    let updated = [...sorted];
    const { parentIndex, childIndex } = deleteTarget;

    if (childIndex !== undefined) {
      const children = sortByOrder(updated[parentIndex].children || []);
      children.splice(childIndex, 1);
      updated[parentIndex] = { ...updated[parentIndex], children: reindex(children) };
    } else {
      updated.splice(parentIndex, 1);
    }

    onChange(reindex(updated));
    setDeleteTarget(null);
  }

  const deleteItemLabel =
    deleteTarget !== null
      ? deleteTarget.childIndex !== undefined
        ? sortByOrder(sorted[deleteTarget.parentIndex]?.children || [])[deleteTarget.childIndex]?.label
        : sorted[deleteTarget.parentIndex]?.label
      : "";

  return (
    <div className="space-y-6">
      {/* Item list */}
      <AdminCard padding="none">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            {menuName === "main" ? "Main Navigation" : "Footer Navigation"} Items
          </h3>
          <AdminButton size="sm" onClick={openAddModal} icon={<PlusIcon />}>
            Add Item
          </AdminButton>
        </div>

        {sorted.length === 0 ? (
          <EmptyState onAdd={openAddModal} />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {sorted.map((item, idx) => {
              const children = sortByOrder(item.children || []);
              return (
                <div key={item.id}>
                  <NavItemRow
                    item={item}
                    index={idx}
                    total={sorted.length}
                    onMoveUp={() => moveItem(idx, -1)}
                    onMoveDown={() => moveItem(idx, 1)}
                    onEdit={() => openEditModal(idx)}
                    onDelete={() => confirmDelete(idx)}
                    onAddChild={() => openAddChildModal(idx)}
                  />
                  {children.map((child, cIdx) => (
                    <NavItemRow
                      key={child.id}
                      item={child}
                      index={cIdx}
                      total={children.length}
                      isChild
                      parentIndex={idx}
                      childTotal={children.length}
                      onMoveUp={() => moveChild(idx, cIdx, -1)}
                      onMoveDown={() => moveChild(idx, cIdx, 1)}
                      onEdit={() => openEditModal(idx, cIdx)}
                      onDelete={() => confirmDelete(idx, cIdx)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      {/* Preview */}
      <AdminCard>
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">
          Preview
        </h3>
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg">
          <NavPreview items={sorted} menuName={menuName} />
        </div>
        {menuName === "main" && sorted.some((i) => i.children && i.children.length > 0) && (
          <p className="text-xs text-[var(--muted)] mt-2">
            Hover over items with children to preview dropdown menus.
          </p>
        )}
      </AdminCard>

      {/* Add / Edit modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editTarget
            ? "Edit Navigation Item"
            : addChildParentIndex !== null
              ? "Add Child Item"
              : "Add Navigation Item"
        }
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleModalSubmit}>
              {editTarget ? "Save Changes" : "Add Item"}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput
            label="Label"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            placeholder="e.g. About"
            autoFocus
          />
          <AdminInput
            label="URL"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            placeholder="e.g. /about"
          />
        </div>
      </AdminModal>

      {/* Delete confirmation modal */}
      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Navigation Item"
        description={`Are you sure you want to delete "${deleteItemLabel}"? This action cannot be undone.`}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={executeDelete}>
              Delete
            </AdminButton>
          </>
        }
      >
        <div />
      </AdminModal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NavigationPage() {
  const menus = useQuery(api.navigation.list);
  const upsert = useMutation(api.navigation.upsert);

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Local state for both menus, initialised from server data
  const [localItems, setLocalItems] = useState<Record<MenuName, NavItem[]>>({
    main: [],
    footer: [],
  });
  const [initialised, setInitialised] = useState<Record<MenuName, boolean>>({
    main: false,
    footer: false,
  });

  // Sync server -> local (only once per menu, or when menus change from undefined)
  if (menus && !initialised.main) {
    const mainMenu = menus.find((m: { name: string }) => m.name === "main");
    const footerMenu = menus.find((m: { name: string }) => m.name === "footer");
    setLocalItems({
      main: mainMenu ? sortByOrder(mainMenu.items as NavItem[]) : [],
      footer: footerMenu ? sortByOrder(footerMenu.items as NavItem[]) : [],
    });
    setInitialised({ main: true, footer: true });
  }

  const handleChange = useCallback(
    (menu: MenuName) => (items: NavItem[]) => {
      setLocalItems((prev) => ({ ...prev, [menu]: items }));
      setHasChanges(true);
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        upsert({ name: "main", items: localItems.main }),
        upsert({ name: "footer", items: localItems.footer }),
      ]);
      toast.success("Navigation saved successfully");
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to save navigation:", err);
      toast.error("Failed to save navigation");
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = menus === undefined;

  return (
    <div>
      <AdminHeader
        title="Navigation"
        description="Manage your site navigation menus"
        actions={
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs text-[var(--accent)]">Unsaved changes</span>
            )}
            <AdminButton
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!hasChanges || isLoading}
            >
              Save Changes
            </AdminButton>
          </div>
        }
      />

      <div className="p-6 max-w-3xl">
        {isLoading ? (
          <AdminCard>
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-5 w-5 text-[var(--muted)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-sm text-[var(--muted)]">Loading menus...</span>
            </div>
          </AdminCard>
        ) : (
          <AdminTabs
            tabs={[
              {
                id: "main",
                label: "Main Navigation",
                content: (
                  <MenuEditor
                    menuName="main"
                    items={localItems.main}
                    onChange={handleChange("main")}
                  />
                ),
              },
              {
                id: "footer",
                label: "Footer Navigation",
                content: (
                  <MenuEditor
                    menuName="footer"
                    items={localItems.footer}
                    onChange={handleChange("footer")}
                  />
                ),
              },
            ]}
            defaultTab="main"
          />
        )}
      </div>
    </div>
  );
}
