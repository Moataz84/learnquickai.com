import connectDB from "@/utils/db"
import { cookies } from "next/headers"
import "@/app/globals.css"

export const metadata = {
  title: "Home",
  icons: {
    icon: "/logo-black.png",
  }
}

export default async function RootLayout({ children }) {
  await connectDB()
  const cookiesJar = await cookies()
  const darkMode = cookiesJar?.get("darkMode")

  return (
    <html lang="en" className={darkMode?.value === "true"? "dark" : ""}>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
