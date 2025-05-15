import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg mb-6 text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button className="cursor-pointer">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}