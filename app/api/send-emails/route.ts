import { Resend } from 'resend';

// Create an instance of Resend using your API key
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the JSON body
    const { to, subject, html } = await req.json() as {
      to: string;
      subject: string;
      html: string;
    };

    // Send the email
    const response = await resend.emails.send({
      from: 'Shop <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
