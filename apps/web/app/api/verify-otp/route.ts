import { NextResponse } from 'next/server'
// import prisma from '@repo/db/client'

export async function POST(req: Request) {
  // const { phoneNumber, code } = await req.json()
  // if (!phoneNumber || !code) {
  //   return NextResponse.json({ error: 'Missing phone or code' }, { status: 400 })
  // }

  // const otp = await prisma.oTP.findFirst({
  //   where: {
  //     phoneNumber,
  //     code,
  //     isVerified: false,
  //     expiresAt: { gt: new Date() },
  //   },
  //   orderBy: { createdAt: 'desc' },
  // })

  // if (!otp) {
  //   return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
  // }

  // await prisma.oTP.update({
  //   where: { id: otp.id },
  //   data: { isVerified: true },
  // })

  // let user = await prisma.user.findUnique({ where: { phoneNumber } })

  // if (!user) {
  //   user = await prisma.user.create({
  //     data: {
  //       phoneNumber,
  //       balance: 0,
  //     },
  //   })
  // }

  // return NextResponse.json({ success: true })
  return NextResponse.json({ success: true, userId: 'demo-user' })
}
