import Link from "next/link";
import { categories } from "@/data/dummy";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-white">
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {SITE_TAGLINE}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
