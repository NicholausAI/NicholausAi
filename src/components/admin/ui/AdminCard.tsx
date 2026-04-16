interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function AdminCard({
  children,
  className = "",
  padding = "md",
}: AdminCardProps) {
  return (
    <div
      className={`
        bg-[var(--surface)] border border-[var(--border)] rounded-xl
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
