import { cookies } from "next/headers"

export default async function getLightMode() {
  const cookiesJar = await cookies()
  const lightMode = cookiesJar?.get("lightMode")
  return lightMode?.value === "true"? true : false
}