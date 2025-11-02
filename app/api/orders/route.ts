import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { OrderData } from '../../../types';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
      // Don't fail the order if email fails
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
  shipping 
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
      subject: `🎧 Order Confirmation #${orderId.substring(0, 8).toUpperCase()}`,
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
  shipping 
}: {
  orderId: string;
  customerName: string;
  items: OrderData['items'];
  totals: OrderData['totals'];
  shipping: OrderData['shipping'];
}) {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #f1f1f1;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 15px;">
              <img src="${item.image}" alt="${item.name}" 
                style="width: 64px; height: 64px; border-radius: 8px; object-fit: cover; display: block;" />
            </td>
            <td>
              <strong style="color: #101010; font-size: 15px; display: block; margin-bottom: 5px;">${item.name}</strong>
              <span style="color: #888; font-size: 14px; font-weight: 700;">$${item.price.toLocaleString()}</span>
            </td>
          </tr>
        </table>
      </td>
      <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #f1f1f1;">
        <span style="color: #888; font-weight: 700;">x${item.quantity}</span>
      </td>
      <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #f1f1f1;">
        <strong style="color: #101010; font-size: 16px;">$${(item.price * item.quantity).toLocaleString()}</strong>
      </td>
    </tr>
  `).join('');

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
            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 100%;">
              
              <!-- Header - Orange Background -->
              <tr>
                <td style="background-color: #D87D4A; padding: 48px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 36px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                    THANK YOU! 🎉
                  </h1>
                  <p style="margin: 12px 0 0; color: #FFFFFF; font-size: 16px; opacity: 0.95; letter-spacing: 1px; text-transform: uppercase;">
                    Your Order Has Been Confirmed
                  </p>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 16px; font-size: 24px; color: #101010; font-weight: 700;">
                    Hi ${customerName}! 👋
                  </h2>
                  <p style="margin: 0 0 24px; line-height: 25px; color: #101010; opacity: 0.7; font-size: 15px;">
                    We're excited to let you know that we've received your order and it's being processed. 
                    You'll receive a shipping confirmation email once your items are on their way.
                  </p>

                  <!-- Order ID Badge -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px; background-color: #FAFAFA; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-right: 12px;">
                              <div style="background-color: #D87D4A; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #FFF; font-size: 20px;">📦</span>
                              </div>
                            </td>
                            <td>
                              <strong style="color: #101010; font-size: 13px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Order ID</strong>
                              <span style="color: #101010; opacity: 0.7; font-size: 14px; font-family: monospace;">#${orderId.substring(0, 12).toUpperCase()}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Summary Heading -->
                  <h3 style="margin: 0 0 20px; font-size: 18px; color: #101010; letter-spacing: 1.29px; text-transform: uppercase; font-weight: 700;">
                    📋 Order Summary
                  </h3>

                  <!-- Order Items -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f1f1f1; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
                    ${itemsHTML}
                  </table>

                  <!-- Totals -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #f1f1f1; padding-top: 20px; margin-bottom: 32px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #101010; opacity: 0.6; font-size: 15px;">Subtotal</span>
                      </td>
                      <td style="text-align: right; padding: 8px 0;">
                        <strong style="color: #101010; font-size: 16px;">$${totals.subtotal.toLocaleString()}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #101010; opacity: 0.6; font-size: 15px;">Shipping</span>
                      </td>
                      <td style="text-align: right; padding: 8px 0;">
                        <strong style="color: #101010; font-size: 16px;">$${totals.shipping}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #101010; opacity: 0.6; font-size: 15px;">VAT (Included)</span>
                      </td>
                      <td style="text-align: right; padding: 8px 0;">
                        <strong style="color: #101010; font-size: 16px;">$${totals.vat.toLocaleString()}</strong>
                      </td>
                    </tr>
                    <tr style="border-top: 2px solid #D87D4A;">
                      <td style="padding: 20px 0 0;">
                        <strong style="color: #101010; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Grand Total</strong>
                      </td>
                      <td style="text-align: right; padding: 20px 0 0;">
                        <strong style="color: #D87D4A; font-size: 20px;">$${totals.grandTotal.toLocaleString()}</strong>
                      </td>
                    </tr>
                  </table>

                  <!-- Shipping Address -->
                  <h3 style="margin: 0 0 16px; font-size: 18px; color: #101010; letter-spacing: 1.29px; text-transform: uppercase; font-weight: 700;">
                    🚚 Shipping Address
                  </h3>
                  <div style="background-color: #FAFAFA; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
                    <p style="margin: 0; line-height: 24px; color: #101010; opacity: 0.8; font-size: 15px;">
                      ${shipping.address}<br />
                      ${shipping.city}, ${shipping.zipCode}<br />
                      ${shipping.country}
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                    <tr>
                      <td align="center">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/confirmation?orderId=${orderId}" 
                           style="display: inline-block; padding: 16px 40px; background-color: #D87D4A; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; border-radius: 0; transition: background-color 0.3s;">
                          VIEW YOUR ORDER →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Help Section -->
                  <div style="background-color: #FAFAFA; padding: 24px; border-radius: 8px; text-align: center; border-left: 4px solid #D87D4A;">
                    <p style="margin: 0 0 8px; color: #101010; font-size: 15px; font-weight: 700;">
                      Need Help? 💬
                    </p>
                    <p style="margin: 0; color: #101010; opacity: 0.7; font-size: 14px; line-height: 22px;">
                      Our support team is here for you!<br />
                      Email us at <a href="mailto:support@audiophile.com" style="color: #D87D4A; text-decoration: none; font-weight: 700;">support@audiophile.com</a>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer - Black Background -->
              <tr>
                <td style="background-color: #101010; padding: 32px 40px; text-align: center;">
                  <!-- Logo -->
                  <svg width="143" height="25" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 20px;">
                    <path d="M7.363 20.385c1.63 0 3.087-.537 4.237-1.47l.414.994h3.739V5.853h-3.605l-.495 1.087c-1.16-.958-2.637-1.51-4.29-1.51C3.069 5.43 0 8.527 0 12.88c0 4.37 3.07 7.505 7.363 7.505zm.646-4.287c-1.811 0-3.143-1.37-3.143-3.206 0-1.824 1.332-3.195 3.143-3.195 1.812 0 3.144 1.37 3.144 3.195 0 1.836-1.332 3.206-3.144 3.206zm17.535 4.287c4.148 0 6.91-2.562 6.91-6.495V5.853h-4.836v7.811c0 1.47-.782 2.357-2.074 2.357-1.292 0-2.074-.887-2.074-2.357V5.853h-4.836v8.037c0 3.933 2.762 6.495 6.91 6.495zm18.443-.827c1.443 0 2.935-.537 4.237-1.592v1.25h4.48V.435h-4.48v6.442c-1.353-1.04-2.845-1.445-4.237-1.445-4.173 0-7.398 3.062-7.398 7.506 0 4.443 3.225 7.505 7.398 7.505zm.972-4.288c-1.811 0-3.143-1.37-3.143-3.217 0-1.836 1.332-3.206 3.143-3.206 1.811 0 3.143 1.37 3.143 3.206 0 1.846-1.332 3.217-3.143 3.217zm15.4 4.288c3.314 0 5.74-2.015 6.435-5.063h-4.805c-.291.823-1.112 1.318-2.242 1.318-1.569 0-2.608-.89-2.608-2.494h9.655c.05-.434.05-.855.05-1.276 0-4.382-2.864-7.083-6.947-7.083-4.256 0-7.366 3.062-7.366 7.506 0 4.443 3.11 7.092 7.828 7.092zm2.15-8.521h-4.836c.218-1.25 1.112-2.015 2.423-2.015 1.311 0 2.205.765 2.414 2.015zM85.404 20h4.88V5.853h-4.88V20zm0-15.488h4.88V.96h-4.88v3.552zm13.357 15.873c3.167 0 5.74-1.702 6.664-4.288h-4.56c-.291.744-1.16 1.202-2.104 1.202-1.57 0-2.623-1.015-2.623-2.737 0-1.723 1.053-2.738 2.623-2.738.943 0 1.813.458 2.104 1.203h4.56c-.924-2.587-3.497-4.289-6.664-4.289-4.29 0-7.398 3.063-7.398 7.624 0 4.56 3.108 7.023 7.398 7.023zm14.759-.385V11.5c0-1.527.9-2.458 2.354-2.458.943 0 1.625.382 1.943 1.203h4.832c-.582-2.896-3.022-4.916-6.342-4.916-1.625 0-3.058.56-4.219 1.702V5.853h-4.548V20h4.98zm17.446.385c4.561 0 7.712-3.146 7.712-7.623 0-4.478-3.151-7.624-7.712-7.624-4.562 0-7.713 3.146-7.713 7.624 0 4.477 3.151 7.623 7.713 7.623zm0-4.323c-1.745 0-2.97-1.346-2.97-3.3 0-1.955 1.225-3.301 2.97-3.301 1.744 0 2.97 1.346 2.97 3.3 0 1.955-1.226 3.301-2.97 3.301zm12.364 4.323c1.468 0 2.773-.458 3.738-1.298v1.013h4.548V.435h-4.548v6.378c-.965-.84-2.27-1.298-3.738-1.298-3.907 0-6.942 3.146-6.942 7.624 0 4.477 3.035 7.623 6.942 7.623zm.984-4.323c-1.761 0-3.02-1.346-3.02-3.3 0-1.955 1.259-3.301 3.02-3.301 1.761 0 3.02 1.346 3.02 3.3 0 1.955-1.259 3.301-3.02 3.301z" fill="#FFF" fillRule="nonzero"/>
                  </svg>
                  
                  <p style="margin: 0 0 12px; color: #FFFFFF; font-size: 14px; opacity: 0.8; line-height: 22px;">
                    Questions? We're here to help!<br />
                    Contact us at <a href="mailto:support@audiophile.com" style="color: #D87D4A; text-decoration: none;">support@audiophile.com</a>
                  </p>
                  
                  <p style="margin: 0; color: #FFFFFF; font-size: 12px; opacity: 0.6;">
                    © ${new Date().getFullYear()} Audiophile. All Rights Reserved.
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