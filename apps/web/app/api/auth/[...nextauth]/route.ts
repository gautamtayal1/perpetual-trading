import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from '@repo/db/client'

declare module "next-auth" {
  interface User {
    id: string;
    phoneNumber: string;
    balance: number;
  }
  
  interface Session {
    user: {
      id: string;
      phoneNumber: string;
      balance: number;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phoneNumber: string;
    balance: number;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phoneNumber: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phoneNumber
        if (!phone) return null

        // const otp = await prisma.oTP.findFirst({
        //   where: {
        //     phoneNumber: phone,
        //     isVerified: true,
        //     expiresAt: { gt: new Date() },
        //   },
        //   orderBy: { createdAt: 'desc' },
        // })
      
        // if (!otp) {
        //   return null
        // }

        //auth bypass for demo-user
        if (phone === '1234') {
          return {
            id: 'demo-user',
            phoneNumber: '1234',
            balance: 100000
          }
        }
        if (phone === '123456') {
          return {
            id: 'demo-user2',
            phoneNumber: '123456',
            balance: 100000
          }
        }
        if (phone === '0000') {
          return {
            id: 'demo-user3',
            phoneNumber: '0000',
            balance: 100000
          }
        }
      
        const user = await prisma.user.findUnique({
          where: { phoneNumber: phone },
        })

        if (!user) return null

        // await prisma.oTP.update({
        //   where: { id: otp.id },
        //   data: { isVerified: false },
        // })

        return user ? { id: user.id, phoneNumber: user.phoneNumber, balance: user.balance } : null
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phoneNumber = user.phoneNumber
        token.balance = user.balance
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.phoneNumber = token.phoneNumber
        session.user.balance = token.balance
      }
      return session
    },    
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
  