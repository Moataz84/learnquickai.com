import connectDB from "@/utils/db"
import { cookies } from "next/headers"
import "@/app/globals.css"
import { Fira_Code } from 'next/font/google';

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export default async function RootLayout({ children }) {
  await connectDB()
  const cookiesJar = await cookies()
  const darkMode = cookiesJar?.get("darkMode")

  return (
    <html lang="en" className={`${firaCode.variable} ${darkMode?.value === "true"? "dark" : ""}`}>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
