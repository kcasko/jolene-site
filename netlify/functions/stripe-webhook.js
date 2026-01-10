/**
 * Netlify Serverless Function: Stripe Webhook Handler
 *
 * Handles Stripe webhook events, particularly successful payments.
 * When a payment succeeds:
 * - Logs the purchase
 * - Sends confirmation email with download link (for digital products)
 * - Notifies artist of new sale
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Stripe webhook signing secret
 * - CONTACT_EMAIL: Email to notify for new sales
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Verify webhook signature
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook handler failed' })
    };
  }
};

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  const { artworkId, variant, artworkTitle } = session.metadata;

  // For digital products, generate download link
  if (variant === 'digital') {
    // In production, you would:
    // 1. Generate a secure download link
    // 2. Send email with download link via SendGrid/Mailgun
    // 3. Set expiration on download link (24 hours)

    console.log(`Digital download purchase: ${artworkTitle} (${artworkId})`);

    // TODO: Send download email
    // await sendDigitalDownloadEmail(session.customer_details.email, artworkTitle, downloadLink);
  } else {
    // For physical prints, log the order
    console.log(`Physical print order: ${artworkTitle} - ${variant}`);

    // TODO: Send order confirmation email
    // TODO: Notify artist to fulfill order
  }

  // Notify artist of new sale
  await notifyArtistOfSale(session, artworkTitle, variant);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Additional payment success handling if needed
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  console.error('Payment failed:', paymentIntent.id);
  // Log failed payments for review
}

/**
 * Notify artist of new sale via email
 * In production, integrate with SendGrid, Mailgun, or Netlify Forms
 */
async function notifyArtistOfSale(session, artworkTitle, variant) {
  const customerEmail = session.customer_details?.email || 'Unknown';
  const customerName = session.customer_details?.name || 'Unknown';
  const amount = (session.amount_total / 100).toFixed(2);

  console.log('New sale notification:');
  console.log(`- Artwork: ${artworkTitle}`);
  console.log(`- Variant: ${variant}`);
  console.log(`- Customer: ${customerName} (${customerEmail})`);
  console.log(`- Amount: $${amount} USD`);

  // TODO: Send email notification
  // await sendEmail({
  //   to: process.env.CONTACT_EMAIL,
  //   subject: `New Sale: ${artworkTitle}`,
  //   body: emailTemplate
  // });
}
