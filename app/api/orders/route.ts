import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { OrderData } from '../../../types';

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL is not defined in your environment!');
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request: Request) {
  try {
    const data: OrderData = await request.json();

    if (!data.customer || !data.shipping || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save order to Convex
    const result = await convex.mutation(api.orders.createOrder, {
      customerName: data.customer.name,
      customerEmail: data.customer.email,
      customerPhone: data.customer.phone,
      shippingAddress: data.shipping.address,
      shippingZipCode: data.shipping.zipCode,
      shippingCity: data.shipping.city,
      shippingCountry: data.shipping.country,
      paymentMethod: data.payment.method,
      eMoneyNumber: data.payment.eMoneyNumber,
      eMoneyPin: data.payment.eMoneyPin,
      items: data.items,
      subtotal: data.totals.subtotal,
      shipping: data.totals.shipping,
      vat: data.totals.vat,
      grandTotal: data.totals.grandTotal,
      status: data.status,
      createdAt: data.createdAt,
    });

    // Send confirmation email
    try {
      console.log('📧 Attempting to send email to:', data.customer.email);
      await sendOrderConfirmationEmail({
        orderId: result.orderId,
        customerName: data.customer.name,
        customerEmail: data.customer.email,
        items: data.items,
        totals: data.totals,
        shipping: data.shipping,
      });
      console.log('✅ Email sent successfully!');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don’t fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Email sending function
async function sendOrderConfirmationEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  totals,
  shipping,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderData['items'];
  totals: OrderData['totals'];
  shipping: OrderData['shipping'];
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping email');
    return;
  }

  const emailHtml = generateOrderEmailHTML({
    orderId,
    customerName,
    items,
    totals,
    shipping,
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: 'Audiophile Store <onboarding@resend.dev>', // Change to your verified domain
      to: customerEmail,
      subject: `🎧 Order Confirmation #${orderId
        .substring(0, 8)
        .toUpperCase()}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Email API error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

// Generate HTML email template
function generateOrderEmailHTML({
  orderId,
  customerName,
  items,
  totals,
  shipping,
}: {
  orderId: string;
  customerName: string;
  items: OrderData['items'];
  totals: OrderData['totals'];
  shipping: OrderData['shipping'];
}) {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #f1f1f1;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 15px;">
              <img src="${item.image}" alt="${item.name}" 
                style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; display: block;" />
            </td>
            <td>
              <strong style="color: #101010; font-size: 15px; display: block; margin-bottom: 5px;">${
                item.name
              }</strong>
              <span style="color: #888; font-size: 14px; font-weight: 700;">$${item.price.toLocaleString()}</span>
            </td>
          </tr>
        </table>
      </td>
      <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #f1f1f1;">
        <span style="color: #888; font-weight: 700;">x${item.quantity}</span>
      </td>
      <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #f1f1f1;">
        <strong style="color: #101010; font-size: 16px;">$${(
          item.price * item.quantity
        ).toLocaleString()}</strong>
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F1F1F1;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background‑color: #F1F1F1; padding: 40px 20px;">
        <!-- rest of your HTML template unchanged -->
  `;
}
