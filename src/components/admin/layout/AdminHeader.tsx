"use client";

import { useSession } from "next-auth/react";

interface AdminHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm px-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>
        {description && (
          typeof description === "string" ? (
            <p className="text-sm text-[var(--muted)]">{description}</p>
          ) : (
            <div className="text-sm text-[var(--muted)]">{description}</div>
          )
        )}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-sm font-medium text-[var(--foreground)]">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-sm text-[var(--muted)]">
            {session?.user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
