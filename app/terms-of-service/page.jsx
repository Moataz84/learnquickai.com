import Menu from "@/components/Menu"

export const metadata = {
  title: "LearnQuick AI - Terms of Service"
}

export default function TermsOfService() {
  return (
    <>
      <Menu />
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">📜 Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Please read these terms and conditions carefully before using our website.
          </p>
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our site.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Changes to the Terms</h2>
              <p>
                We reserve the right to change, modify, or revise these Terms of Service at any time. Any changes will be effective immediately upon posting. Continued use of the service following changes constitutes acceptance of the new terms.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">3. Use of the Service</h2>
              <p>
                You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the service.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">4. User Accounts</h2>
              <p>
                If you create an account on our platform, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Disclaimer</h2>
              <p>
                The service is provided on an “as is” and “as available” basis. We do not guarantee that the service will be uninterrupted or error-free.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">6. Fair Usage</h2>
              <p>
                To ensure a quality experience for all users, we implement a fair usage policy. Excessive usage in a short period of time — such as repeated, automated, or spam-like behavior — may be considered abusive. We reserve the right to monitor activity and, at our discretion, limit or terminate accounts that violate this policy.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
                <a className="text-blue-500 hover:underline" href="mailto:support@learnquickai.com">
                  support@learnquickai.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}