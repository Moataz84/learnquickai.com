import getUser from "@/actions/auth/get-user"
import getlightMode from "@/actions/lightMode"
import MenuClient from "@/components/MenuClient"

export default async function Menu() {
  const isLightMode = await getlightMode()
  const user = await getUser()
  
  return (
    <MenuClient isLightMode={isLightMode} user={user? true : null}/>
  )
}