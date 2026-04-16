interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
            {value}
          </p>
          {trend && (
            <p
              className={`mt-2 text-sm flex items-center gap-1 ${
                trend.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              <svg
                className={`w-4 h-4 ${!trend.positive && "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              {trend.value}%
              {description && (
                <span className="text-[var(--muted)]"> {description}</span>
              )}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
          {icon}
        </div>
      </div>
    </div>
  );
}
