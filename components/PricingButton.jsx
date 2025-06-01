"use client"
import { Button } from "@/components/ui/button"
import createCheckout from "@/actions/checkout"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function PricingButton({ children, email, active, id, className }) {
  if (active === null) return <Link href="/auth/login"><Button className={className}>{children}</Button></Link>
  if (active) return <Link href={`https://billing.stripe.com/p/login/6oUcN5ciMcu78fAbBcaVa00?prefilled_email=${email}`}><Button className={className}>{children}</Button></Link>

  async function handleClick() {
    if (id === "year") {
      const url = await createCheckout(email, "price_1RV4VFG2GpyU7y3q1MIu0ygx")
      return redirect(url)
    }
    const url = await createCheckout(email, "price_1RPR2DG2GpyU7y3qEB6WHIf1")
    redirect(url)
  }
  
  return (
    <Button className={className} id={id} onClick={handleClick}>{children}</Button>
  )
}