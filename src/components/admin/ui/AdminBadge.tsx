type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface AdminBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--surface-elevated)] text-[var(--muted)]",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20",
};

export function AdminBadge({
  variant = "default",
  children,
  className = "",
}: AdminBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
