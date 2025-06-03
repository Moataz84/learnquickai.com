import getUser from "@/actions/auth/get-user"
import getUsage from "@/actions/getUsage"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "LearnQuick AI - Rate Limit"
}

export default async function RateLimitPage() {

  const user = await getUser()
  const { cost } = await getUsage(user?.id)
  if (cost < 3.5) return redirect("/dashboard")
    
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-400">
          Account Temporarily Limited
        </h1>

        <p className="text-base text-muted-foreground">
          Our system has detected that your activity appears excessive or spam-like.
        </p>

        <p className="text-sm text-muted-foreground">
          As part of our <strong>Fair Usage Policy</strong>, your account has been temporarily restricted.
          To learn more about our Fair Usage Policy, please see our{" "}
          <Link
            href="/terms-of-service"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Terms of Service
          </Link>.
        </p>

        <p className="text-sm">
          If you believe this is a mistake, contact us at{" "}
          <a
            href="mailto:support@learnquickai.com"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            support@learnquickai.com
          </a>.
        </p>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
