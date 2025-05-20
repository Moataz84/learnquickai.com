import ForgotPasswordEmail from "@/components/ForgotPasswordEmail"
import ResetPassword from "@/components/ResetPassword"
import Users from "@/utils/Models/Users"

export const metadata = {
  title: "LearnQuick AI - Forgot Password"
}

export default async function ForgotPassword({ searchParams }) {

  async function verifyCode() {
    const { id, email } = await searchParams
    if (!id || !email) return false
    const user = await Users.findOne({email})
    if (user?.forgotPasswordCode !== id) return false
    return true
  }

  const verified = await verifyCode()
  return (
    <>
      {verified? <ResetPassword /> : <ForgotPasswordEmail />}
    </>
  )
}