import getUser from "@/actions/auth/get-user"
import getDarkMode from "@/actions/darkmode"
import MenuClient from "@/components/MenuClient"

export default async function Menu() {
  const isDarkMode = await getDarkMode()
  const user = await getUser()
  
  return (
    <MenuClient isDarkMode={isDarkMode} user={user? true : null}/>
  )
}