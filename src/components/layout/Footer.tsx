import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/dummy";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

const currentYear = new Date().getFullYear();

const linkClass =
  "text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 min-h-[44px] flex items-center justify-center sm:py-0 sm:min-h-0 sm:justify-start";

const headingClass =
  "text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:text-base sm:text-zinc-900 sm:dark:text-white";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Mobile: stacked, centered. Desktop: grid, left-aligned */}
        <div className="flex flex-col items-center gap-8 text-center sm:grid sm:grid-cols-2 sm:items-start sm:gap-8 sm:text-left lg:grid-cols-4">
          {/* Brand at top on mobile and first column on desktop */}
          <div className="order-1 flex w-full flex-col items-center sm:order-1 sm:items-start">
            <Link href="/" className="inline-flex items-center" aria-label={`${SITE_NAME} - Home`}>
              <Image
                src="/NTR.svg"
                alt={SITE_NAME}
                width={73}
                height={30}
                className="h-8 w-auto invert dark:invert-0"
              />
            </Link>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:max-w-none">
              {SITE_TAGLINE}
            </p>
          </div>
          {/* Categories — second on mobile; second column on desktop */}
          <div className="order-2 flex w-full flex-col items-center sm:order-2 sm:items-start">
            <h3 className={headingClass}>Categories</h3>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:mt-4 sm:flex-col sm:space-y-2 sm:space-x-0 sm:gap-x-0 sm:gap-y-0">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/articles?category=${cat.slug}`} className={linkClass}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div className="order-3 flex w-full flex-col items-center sm:order-3 sm:items-start">
            <h3 className={headingClass}>Company</h3>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:mt-4 sm:flex-col sm:space-y-2 sm:space-x-0 sm:gap-x-0 sm:gap-y-0">
              <li>
                <Link href="/about" className={linkClass}>About</Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>Contact</Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div className="order-4 flex w-full flex-col items-center sm:items-start sm:order-4">
            <h3 className={headingClass}>Legal</h3>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:mt-4 sm:flex-col sm:space-y-2 sm:space-x-0 sm:gap-x-0 sm:gap-y-0">
              <li>
                <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className={linkClass}>Terms of Use</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 sm:mt-12 sm:pt-8 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
