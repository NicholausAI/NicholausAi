interface AuthorBoxProps {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  twitterHandle?: string;
}

export function AuthorBox({
  name = "Nicholaus.ai",
  bio = "Building in the shadows. Development, trading, and creating from the depths.",
  avatarUrl,
  twitterHandle = "nicholausai",
}: AuthorBoxProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
      {/* Avatar */}
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border)]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-muted)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--background)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          {twitterHandle && (
            <a
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Follow</span>
            </a>
          )}
        </div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
