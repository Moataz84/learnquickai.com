import getUser from "@/actions/auth/get-user"
import getDarkMode from "@/actions/darkmode"
import SideMenuClient from "@/components/SideMenuClient"

export default async function SideMenu({ promptId }) {
  const isDarkMode = await getDarkMode()
  const user = await getUser()
  
  return (
    <SideMenuClient isDarkMode={isDarkMode} user={user? true : null} promptId={promptId} />
  )
}