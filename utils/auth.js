import { compare } from "bcrypt"
import Users from "@/utils/Models/Users"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await Users.findOne({email: credentials.email})
        const result = await compare(credentials.password, user.password)
        if (result) {
          return {id: user.id}
        }
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  secret: process.env.ACCESS_TOKEN,
  callbacks: {
    async jwt({token, user, account}) {
      if (user && account?.provider === "google") {
        const existingUser = await Users.findOne({email: user.email})
  
        if (existingUser) {
          token.id = existingUser.id
        } else {
          const newUser = await new Users({
            name: user.name, 
            email: user.email, 
            password: "",
            verified: true,
            code: "",
            forgotPasswordCode: "",
            active: false,
            credentials: false
          }).save()
          token.id = newUser.id
        }
      }
  
      if (user?.id && !token.id) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7
  }
}