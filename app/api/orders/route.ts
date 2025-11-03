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
    <body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F1F1F1;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1F1F1; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #D87D4A; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎧 Audiophile</h1>
                </td>
              </tr>

              <!-- Thank You Message -->
              <tr>
                <td style="padding: 40px 40px 20px;">
                  <h2 style="margin: 0 0 15px; color: #101010; font-size: 24px; font-weight: 700;">Thank You, ${customerName}!</h2>
                  <p style="margin: 0; color: #888; font-size: 15px; line-height: 1.6;">
                    Your order has been confirmed. Order number: <strong>#${orderId.substring(0, 8).toUpperCase()}</strong>
                  </p>
                </td>
              </tr>

              <!-- Order Items -->
              <tr>
                <td style="padding: 0 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f1f1f1; border-radius: 8px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #F1F1F1;">
                        <th style="padding: 15px 10px; text-align: left; color: #888; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                        <th style="padding: 15px 10px; text-align: center; color: #888; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                        <th style="padding: 15px 10px; text-align: right; color: #888; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHTML}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding: 30px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 8px 0; color: #888; font-size: 15px;">Subtotal</td>
                      <td style="padding: 8px 0; text-align: right; color: #101010; font-weight: 700; font-size: 15px;">$${totals.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #888; font-size: 15px;">Shipping</td>
                      <td style="padding: 8px 0; text-align: right; color: #101010; font-weight: 700; font-size: 15px;">$${totals.shipping.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #888; font-size: 15px;">VAT (included)</td>
                      <td style="padding: 8px 0; text-align: right; color: #101010; font-weight: 700; font-size: 15px;">$${totals.vat.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 0; color: #888; font-size: 15px; text-transform: uppercase;">Grand Total</td>
                      <td style="padding: 15px 0 0; text-align: right; color: #D87D4A; font-weight: 700; font-size: 18px;">$${totals.grandTotal.toLocaleString()}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="background-color: #F1F1F1; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 10px; color: #101010; font-size: 14px; font-weight: 700; text-transform: uppercase;">Shipping Address</h3>
                    <p style="margin: 0; color: #888; font-size: 15px; line-height: 1.6;">
                      ${shipping.address}<br>
                      ${shipping.city}, ${shipping.zipCode}<br>
                      ${shipping.country}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #101010; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0; color: #ffffff; font-size: 14px; opacity: 0.5;">
                    © 2024 Audiophile. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
