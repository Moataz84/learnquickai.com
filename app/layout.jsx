import connectDB from "@/utils/db"
import { cookies } from "next/headers"
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
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
