import { Resend } from 'resend';

interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export default async function sendEmail({ to, subject, html }: EmailParams) {
  const resend = new Resend(process.env.RESEND_API_KEY as string); 

  try {
    const response = await resend.emails.send({
      from: 'Shop <onboarding@resend.dev>', // sandbox sender
      to,
      subject,
      html,
    });
    return response;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
}
