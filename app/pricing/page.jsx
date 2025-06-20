import getUser from "@/actions/auth/get-user"
import Menu from "@/components/Menu"
import PricingButton from "@/components/PricingButton"

export const metadata = {
  title: "LearnQuick AI - Pricing"
}

export default async function PricingPage() {
  const user = await getUser()

  return (
    <>
      <Menu />
      <div className="flex flex-col items-center justify-start px-4 py-12 text-foreground">
        <div className="max-w-2xl text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Flexible pricing options for individuals. Start with a limited free tier — no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <div className="border rounded-2xl p-6 bg-card shadow-sm relative dark:bg-gray-800 order-1 md:order-none">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
              Most Flexible
            </div>
            <h2 className="text-2xl font-semibold mb-1">Pro Weekly</h2>
            <p className="text-muted-foreground text-sm mb-4">Try premium features without commitment</p>
            <div className="text-4xl font-bold mb-4">
              $2.99 <span className="text-base font-normal">/ week</span>
              <div className="text-sm text-muted-foreground">Billed weekly</div>
            </div>
            <ul className="text-sm space-y-2 mb-6">
              <li>✓ Unlimited video summarization</li>
              <li>✓ Unlimited document summarization</li>
              <li>✓ Flashcard & quiz generation</li>
              <li>✓ Multiplayer study game with friends</li>
              <li>✓ Priority support</li>
              <li>✓ Cancel anytime — no long-term commitment</li>
            </ul>
            <PricingButton className="w-full cursor-pointer" id="week" active={user?.active} email={user?.email}>
              Subscribe Weekly
            </PricingButton>
          </div>

          <div className="border rounded-2xl p-6 bg-card shadow-sm relative dark:bg-gray-800 order-2 md:order-none">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
              Most Popular
            </div>
            <h2 className="text-2xl font-semibold mb-1">Pro Monthly</h2>
            <p className="text-muted-foreground text-sm mb-4">Perfect balance of cost and features</p>
            <div className="text-4xl font-bold mb-4">
              $10.99 <span className="text-base font-normal">/ month</span>
              <div className="text-sm text-muted-foreground">Billed monthly</div>
            </div>
            <ul className="text-sm space-y-2 mb-6">
              <li>✓ Unlimited video summarization</li>
              <li>✓ Unlimited document summarization</li>
              <li>✓ Flashcard & quiz generation</li>
              <li>✓ Multiplayer study game with friends</li>
              <li>✓ Priority support</li>
              <li>✓ Access to new features each month</li>
            </ul>
            <PricingButton id="month" className="w-full cursor-pointer" active={user?.active} email={user?.email}>
              Subscribe Monthly
            </PricingButton>
          </div>

          <div className="border rounded-2xl p-6 bg-card shadow-sm relative dark:bg-gray-800 order-3 md:order-none">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
              Save 45%
            </div>
            <h2 className="text-2xl font-semibold mb-1">Pro Yearly</h2>
            <p className="text-muted-foreground text-sm mb-4">Best for power users and long-term value</p>
            <div className="text-4xl font-bold mb-4">
              $5.99 <span className="text-base font-normal">/ month</span>
              <div className="text-sm text-muted-foreground">Billed yearly</div>
            </div>
            <ul className="text-sm space-y-2 mb-6">
              <li>✓ Unlimited video summarization</li>
              <li>✓ Unlimited document summarization</li>
              <li>✓ Flashcard & quiz generation</li>
              <li>✓ Multiplayer study game with friends</li>
              <li>✓ Priority support</li>
              <li>✓ One-time payment — no monthly billing hassle</li>
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
