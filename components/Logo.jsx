import Link from "next/link"

export default function Logo({ isLightMode }) {
  return (
    <Link href="/" className="flex justify-center items-center gap-2">
      <img src={isLightMode? "/logo-black.png" : "/logo-white.png"} className="w-8" />
      <h1 className="text-2xl font-bold whitespace-nowrap inline-block">LearnQuick AI</h1>
    </Link>
  )
}