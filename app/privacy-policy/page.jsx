import Menu from "@/components/Menu"

export const metadata = {
  title: "Privacy Policy"
}

export default function PrivacyPolicy() {
  return (
    <>
      <Menu />
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">🔒 Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Your privacy is important to us. This policy explains how we handle and protect your data.
          </p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
              <p>
                We collect information you provide directly, such as your name, email address, and messages. We may also collect technical data such as IP address, browser type, and usage behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
              <p>
                We use your information to provide and improve our services, respond to inquiries, send updates, and ensure security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
              <p>
                We do not sell or rent your personal information. We may share data with trusted service providers who help us operate the website, under strict confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience and gather analytics data. You can disable cookies in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
              <p>
                We implement industry-standard measures to protect your data, but no online service is 100% secure. Use our service at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, contact us at{" "}
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