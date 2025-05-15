import { cookies } from "next/headers"

export default async function getDarkMode() {
  const cookiesJar = await cookies()
  const darkMode = cookiesJar?.get("darkMode")
  return darkMode?.value === "true"? true : false
}