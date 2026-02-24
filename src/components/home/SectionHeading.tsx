import Link from "next/link";

interface SectionHeadingProps {
  id?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
}

export function SectionHeading({ id, title, linkHref, linkLabel }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h2 id={id} className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {title}
      </h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
