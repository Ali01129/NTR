import Link from "next/link";
import { categories } from "@/data/dummy";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
          aria-label="NTR - Home"
        >
          NTR
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            aria-label="Search"
          >
            Search
          </Link>
        </div>
      </div>
    </header>
  );
}
