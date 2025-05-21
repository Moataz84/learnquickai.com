import getUser from "@/actions/auth/get-user"
import getLightMode from "@/actions/lightMode"
import SideMenuClient from "@/components/SideMenuClient"

export default async function SideMenu({ promptId }) {
  const isLightMode = await getLightMode()
  const user = await getUser()
  
  return (
    <SideMenuClient isLightMode={isLightMode} user={user? true : null} promptId={promptId} />
  )
}