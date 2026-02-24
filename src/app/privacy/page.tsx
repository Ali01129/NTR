import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. How we collect, use, and protect your information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content" role="main">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-8 space-y-8 text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                1. Information We Collect
              </h2>
              <p className="mt-2 leading-relaxed">
                We may collect information you provide directly (e.g., when you subscribe or contact us), 
                information from your use of our site (e.g., device and log data), and information from 
                cookies and similar technologies. We use this to deliver and improve our content and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                2. How We Use Your Information
              </h2>
              <p className="mt-2 leading-relaxed">
                We use the information we collect to operate and improve our website, personalize your 
                experience, send updates (if you have opted in), analyze usage, and comply with legal 
                obligations. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                3. Cookies and Tracking
              </h2>
              <p className="mt-2 leading-relaxed">
                We may use cookies and similar technologies for essential site functionality, analytics, 
                and (with your consent) advertising. You can manage cookie preferences in your browser 
                settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                4. Data Sharing and Disclosure
              </h2>
              <p className="mt-2 leading-relaxed">
                We may share data with service providers who assist in running our site (e.g., hosting, 
                analytics), when required by law, or to protect our rights and safety. We require 
                partners to protect your data in line with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                5. Your Rights
              </h2>
              <p className="mt-2 leading-relaxed">
                Depending on where you live, you may have the right to access, correct, delete, or 
                restrict use of your personal data, or to object to certain processing. Contact us 
                using the details below to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                6. Contact Us
              </h2>
              <p className="mt-2 leading-relaxed">
                For questions about this Privacy Policy or your personal data, please contact us via 
                our <a href="/contact" className="font-medium text-zinc-900 underline dark:text-white">Contact</a> page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
