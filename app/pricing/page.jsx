import getUser from "@/actions/auth/get-user"
import Menu from "@/components/Menu"
import PricingButton from "@/components/PricingButton"

export const metadata = {
  title: "Pricing"
}

export default async function PricingPage() {
  const user = await getUser()
  console.log(process.env.STRIPE_SECRET_KEY)
  return (
  <>
    <Menu />    
    <div className="flex flex-col items-center justify-start px-4 py-12 text-foreground">
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">Flexible pricing options for individuals. Start with a limited free tier — no credit card required.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Monthly Plan */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm dark:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-1">Pro Monthly</h2>
          <p className="text-muted-foreground text-sm mb-4">Great for short-term needs</p>
          <div className="text-4xl font-bold mb-4">$10.99 <span className="text-base font-normal">/ month</span></div>
          <ul className="text-sm space-y-2 mb-6">
            <li>✓ Full access to all features</li>
            <li>✓ Priority support</li>
            <li>✓ Cancel anytime</li>
          </ul>
          <PricingButton className="w-full cursor-pointer" active={user?.active} email={user?.email}>
            Subscribe Monthly
          </PricingButton>
        </div>

        {/* Yearly Plan */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm relative dark:bg-gray-800">
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
            25% off
          </div>
          <h2 className="text-2xl font-semibold mb-1">Pro Yearly</h2>
          <p className="text-muted-foreground text-sm mb-4">Best value for long-term users</p>
          <div className="text-4xl font-bold mb-4">$98.99 <span className="text-base font-normal">/ year</span></div>
          <ul className="text-sm space-y-2 mb-6">
            <li>✓ Full access to all features</li>
            <li>✓ Priority support</li>
            <li>✓ Cancel anytime</li>
          </ul>
          <PricingButton className="w-full cursor-pointer" id="year" active={user?.active} email={user?.email}>
            Subscribe Yearly
          </PricingButton>
        </div>
      </div>
    </div>
    </>
  )
}