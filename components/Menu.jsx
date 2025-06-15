import getUser from "@/actions/auth/get-user"
import getlightMode from "@/actions/lightMode"
import MenuClient from "@/components/MenuClient"

export default async function Menu() {
  const isLightMode = await getlightMode()
  const user = await getUser()
  
  return (
    <>
      <p className="text-sm font-semibold text-white bg-blue-500 px-3 py-2 text-center text-base">
        🎉 Use code <code className="bg-white text-sky-700 font-bold px-2 py-1 rounded">FIRST50</code> for 50% off – limited to the first 50 users!
      </p>
      <MenuClient isLightMode={isLightMode} user={user? true : null}/>
    </>
  )
}