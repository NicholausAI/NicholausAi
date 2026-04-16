import Link from "next/link";

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
}

export function PostCard({ title, excerpt, slug, publishedAt }: PostCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group py-8 border-b border-[var(--border)] last:border-b-0">
      <Link href={`/blog/${slug}`} className="block">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold group-hover:text-[var(--accent)] transition-colors mb-3">
              {title}
            </h2>
            <p className="text-[var(--muted)] line-clamp-2 leading-relaxed">{excerpt}</p>
          </div>
          <time
            dateTime={publishedAt}
            className="text-sm text-[var(--muted)] whitespace-nowrap mt-1 sm:mt-0"
          >
            {formattedDate}
          </time>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Read more</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>
    </article>
  );
}
