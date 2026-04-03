import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export async function sendWelcomeEmail(
  email: string,
  fullName: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'IMPACT GOLF <noreply@impact-golf.io>',
      to: email,
      subject: 'Welcome to IMPACT GOLF - Start Your Charity Journey',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial; background: #0e0e0e; color: #fff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #cafd00 0%, #3a4a00 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #3a4a00; margin: 0; font-size: 24px; }
              .content { padding: 30px; }
              .button { display: inline-block; background: #cafd00; color: #3a4a00; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ELEGANCE IN GIVING</h1>
              </div>
              <div class="content">
                <p>Hello ${fullName},</p>
                <p>Welcome to IMPACT GOLF! 🏌️</p>
                <p>You're now part of a community that turns passion for golf into positive change. Every score you submit contributes to meaningful charities worldwide.</p>
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
                </p>
                <p style="margin-top: 30px; color: #888; font-size: 14px;">
                  Your subscription is active and your first monthly draw will be held soon. Good luck!
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2026 IMPACT GOLF. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendDrawResultsEmail(
  email: string,
  name: string,
  drawDate: string,
  winningNumbers: number[],
  isWinner: boolean = false,
  prizeAmount: number = 0
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'IMPACT GOLF <noreply@impact-golf.io>',
      to: email,
      subject: isWinner ? `🎉 You Won! ${drawDate} Draw Results` : `Draw Results - ${drawDate}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial; background: #0e0e0e; color: #fff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #cafd00 0%, #3a4a00 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #3a4a00; margin: 0; font-size: 24px; }
              .winning-numbers { text-align: center; margin: 30px 0; }
              .number { display: inline-block; background: #cafd00; color: #3a4a00; width: 50px; height: 50px; border-radius: 50%; line-height: 50px; text-align: center; font-weight: bold; margin: 5px; font-size: 18px; }
              .content { padding: 30px; }
              .winner-badge { background: #cafd00; color: #3a4a00; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold; }
              .button { display: inline-block; background: #cafd00; color: #3a4a00; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${isWinner ? '🎉 YOU WON!' : 'DRAW RESULTS'}</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                <p>The ${drawDate} monthly draw has been completed!</p>
                <p style="margin: 20px 0;"><strong>Winning Numbers:</strong></p>
                <div class="winning-numbers">
                  ${winningNumbers.map((num) => `<div class="number">${num}</div>`).join('')}
                </div>
                ${
                  isWinner
                    ? `
                  <div class="winner-badge">
                    <p>CONGRATULATIONS!</p>
                    <p style="font-size: 24px; margin: 10px 0;">Prize: $${prizeAmount.toLocaleString()}</p>
                    <p>You matched ${winningNumbers.length} numbers!</p>
                  </div>
                  <p style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Details</a>
                  </p>
                `
                    : `
                  <p>Thank you for participating! Better luck next draw!</p>
                `
                }
                <p style="margin-top: 30px; color: #888; font-size: 14px;">
                  Your contributions are creating real impact for charities around the world. ❤️
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2026 IMPACT GOLF. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending draw results email:', error);
    return false;
  }
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  plan: 'monthly' | 'yearly',
  amount: number,
  charityName: string
): Promise<boolean> {
  try {
    const planText = plan === 'monthly' ? 'Monthly ($29)' : 'Annual ($249)';

    await resend.emails.send({
      from: 'IMPACT GOLF <noreply@impact-golf.io>',
      to: email,
      subject: 'Payment Confirmation - IMPACT GOLF Subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial; background: #0e0e0e; color: #fff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #cafd00 0%, #3a4a00 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #3a4a00; margin: 0; font-size: 24px; }
              .content { padding: 30px; }
              .details { background: #26262620; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #fff2; }
              .detail-row:last-child { border-bottom: none; }
              .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ PAYMENT CONFIRMED</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                <p>Thank you for your subscription to IMPACT GOLF! Your payment has been processed successfully.</p>
                <div class="details">
                  <div class="detail-row">
                    <span>Plan</span>
                    <strong>${planText}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Amount</span>
                    <strong>$${amount.toLocaleString()}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Charity Partner</span>
                    <strong>${charityName}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Status</span>
                    <strong style="color: #cafd00;">Active</strong>
                  </div>
                </div>
                <p style="margin-top: 30px; color: #888; font-size: 14px;">
                  You're all set! Start submitting your golf scores and participate in monthly draws. A portion of your subscription goes directly to ${charityName}.
                </p>
              </div>
              <div class="footer">
                <p>&copy; 2026 IMPACT GOLF. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
}
