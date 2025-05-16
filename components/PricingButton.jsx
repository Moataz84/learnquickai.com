"use client"
import { Button } from "@/components/ui/button"
import createCheckout from "@/actions/checkout"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function PricingButton({ children, email, active, id, className }) {
  if (active === null) return <Link href="/auth/login"><Button className={className}>{children}</Button></Link>
  if (active) return <Link href={`https://billing.stripe.com/p/login/test_cN28AmalMegieac4gg?prefilled_email=${email}`}><Button className={className}>{children}</Button></Link>

  async function handleClick() {
    if (id === "year") {
      const url = await createCheckout(email, "price_1RPUuh4fERSy0thU5kJPKD74")
      return redirect(url)
    }
    const url = await createCheckout(email, "price_1RPUu64fERSy0thUndX05Qig")
    redirect(url)
  }
  
  return (
    <Button className={className} id={id} onClick={handleClick}>{children}</Button>
  )
}