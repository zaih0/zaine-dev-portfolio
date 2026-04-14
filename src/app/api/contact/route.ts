import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendEmail(
  name: string,
  email: string,
  message: string,
): Promise<boolean> {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    throw new Error("Email configuration is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: emailUser,
    to: emailUser,
    replyTo: email,
    subject: `Portfolio Contact from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact the site owner.",
        },
        { status: 500 },
      );
    }

    await sendEmail(name, email, message);

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully! I'll get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send email. Please try again later.",
      },
      { status: 500 },
    );
  }
}
