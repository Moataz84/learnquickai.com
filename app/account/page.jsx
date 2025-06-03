import getUser from "@/actions/auth/get-user"
import ChangePassword from "@/components/ChangePassword"
import SideMenu from "@/components/SideMenu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "LearnQuick AI - Account"
}

export default async function AccountPage() {
  const user = await getUser()

  return (
    <div className="flex">
      <SideMenu />
      <div className="pt-26 md:pt-10 px-10 pb-10 flex flex-col items-start w-full">
        <div className="w-full max-w-2xl text-left">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground mb-6">
            Manage your account details and subscription settings
          </p>

          <div className="space-y-6 text-sm text-muted-foreground ">

            {/* Subscription Info */}
            <div className="border border-border p-4 rounded-lg text-left bg-white dark:bg-gray-800">
              <p className="mb-1">
                <span className="font-medium text-foreground">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium text-foreground">Plan:</span>{" "}
                {user.active ? "✅ Pro (Active Subscription)" : "Free Tier"}
              </p>
              {!user.active && (
                <div className="mt-4">
                  <Link href="/pricing">
                    <Button className="w-full sm:w-auto cursor-pointer">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Billing Portal */}
            <div className="border border-border p-4 rounded-lg text-left bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-2 text-foreground">Billing</h2>
              <Link
                href={`https://billing.stripe.com/p/login/6oUcN5ciMcu78fAbBcaVa00?prefilled_email=${user.email}`}
                className="text-sm underline text-primary hover:opacity-80"
              >
                Go to Billing & Payments
              </Link>
            </div>

            {/* Profile Info */}
            <div className="border border-border p-4 rounded-lg text-left bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Profile</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-foreground">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email:</span> {user.email}
                </p>
              </div>
            </div>

            {/* Change Password */}
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  )
}