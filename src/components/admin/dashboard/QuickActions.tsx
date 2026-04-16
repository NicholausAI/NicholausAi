import Link from "next/link";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: "New Post",
    href: "/admin/posts/new",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: "Write a new blog post",
  },
  {
    label: "Send Newsletter",
    href: "/admin/newsletters/new",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: "Create and send a newsletter",
  },
  {
    label: "Add Resource",
    href: "/admin/resources/new",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    description: "Add a new resource",
  },
  {
    label: "View Analytics",
    href: "/admin/analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: "Check your site analytics",
  },
];

export function QuickActions() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl">
      <div className="p-6 border-b border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Quick Actions
        </h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-start gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-all group"
          >
            <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {action.label}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
