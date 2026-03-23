import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  const { email, name, verificationLink } = await req.json()

  await transporter.sendMail({
    from: `"Palm Leaf Sutra" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify your email – Palm Leaf Sutra",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;">
        <h2 style="color:#1a1a1a;">Hi ${name}, please verify your email 👋</h2>
        <p style="color:#555;line-height:1.6;">
          Click the button below to verify your email address and activate your account.
        </p>
        <a href="${verificationLink}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;
                  background:#2d6a4f;color:#fff;border-radius:8px;
                  text-decoration:none;font-weight:600;">
          Verify Email →
        </a>
        <p style="margin-top:24px;color:#aaa;font-size:12px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}