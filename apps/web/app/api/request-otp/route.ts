import { NextResponse } from 'next/server'
// import prisma from '@repo/db/client'
// import { randomInt } from 'crypto'
// import { twilioClient } from "../../lib/twilio"

export async function POST(req: Request) {
  // const { phoneNumber } = await req.json()
  // if (!phoneNumber) return NextResponse.json({ error: 'Missing phone' }, { status: 400 })

  // const code = randomInt(100000, 999999).toString()

  // await prisma.oTP.create({
  //   data: {
  //     phoneNumber,
  //     code,
  //     expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  //   },
  // })

  // await twilioClient.messages.create({
  //   to: phoneNumber,
  //   from: process.env.TWILIO_PHONE_NUMBER!,
  //   body: `Your OTP is ${code}`,
  // })

  return NextResponse.json({ success: true })
}
