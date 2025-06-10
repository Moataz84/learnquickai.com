import connectDB from "@/utils/db"
import { cookies } from "next/headers"
import { GoogleAnalytics } from "@next/third-parties/google"
import "@/app/globals.css"

export const metadata = {
  title: "LearnQuick AI - Home",
  icons: {
    icon: "/favicon.png",
  }
}

export default async function RootLayout({ children }) {
  await connectDB()
  const cookiesJar = await cookies()
  const lightMode = cookiesJar?.get("lightMode")

  return (
    <html lang="en" className={lightMode?.value === "true"? "" : "dark"}>
      {!process.env.NEXT_PUBLIC_ORIGIN?.includes("localhost")? <GoogleAnalytics gaId="G-CMQL4V6Y7F" /> : <></>}
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
