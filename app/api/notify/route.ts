import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { upn } = await request.json()

    const subject = upn === "Unknown"
      ? "New M365 Connection (Email Unknown)"
      : "New Microsoft 365 Connection"
      
    const htmlContent = upn === "Unknown"
      ? `<p>A new Microsoft 365 account was connected, but the user's email could not be determined.</p>`
      : `<p>A new Microsoft 365 account has been connected:</p><p>User Principal Name: ${upn}</p>`

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.EMAIL_RECIPIENT!,
      subject: subject,
      html: htmlContent,
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification email:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}