import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of Use for ${SITE_NAME}. Rules and guidelines for using our website and content.`,
};

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content" role="main">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-8 space-y-8 text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-2 leading-relaxed">
                By accessing or using {SITE_NAME} (“the site”), you agree to be bound by these Terms of Use. 
                If you do not agree, please do not use the site. We may update these terms from time to 
                time; continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                2. Use of Content
              </h2>
              <p className="mt-2 leading-relaxed">
                All content on this site (articles, images, logos, and other materials) is owned by us 
                or our licensors and is protected by copyright. You may read and share content for 
                personal, non-commercial use. You may not copy, modify, redistribute, or use our content 
                for commercial purposes without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                3. User Conduct
              </h2>
              <p className="mt-2 leading-relaxed">
                You agree to use the site lawfully and respectfully. You may not use the site to harass 
                others, post false or harmful information, attempt to gain unauthorized access to our 
                systems, or interfere with the site’s operation. We may suspend or terminate access for 
                violations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                4. Disclaimer
              </h2>
              <p className="mt-2 leading-relaxed">
                The content on this site is for general information only. We do not guarantee its 
                accuracy or completeness. Views expressed in articles are those of the authors and do 
                not necessarily reflect our position. Use of the site and its content is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                5. Limitation of Liability
              </h2>
              <p className="mt-2 leading-relaxed">
                To the fullest extent permitted by law, we are not liable for any indirect, incidental, 
                or consequential damages arising from your use of the site or reliance on its content. 
                Our total liability shall not exceed the amount you paid to use the site (if any) in 
                the twelve months before the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                6. Contact
              </h2>
              <p className="mt-2 leading-relaxed">
                For questions about these Terms of Use, please contact us via our{" "}
                <a href="/contact" className="font-medium text-zinc-900 underline dark:text-white">Contact</a> page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
