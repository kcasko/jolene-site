/**
 * Netlify Serverless Function: Create Stripe Checkout Session
 *
 * This function creates a Stripe Checkout session for purchasing artwork.
 * It accepts product details and redirects users to Stripe's hosted checkout.
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 *
 * Usage:
 * POST /.netlify/functions/create-checkout-session
 * Body: { artworkId, variant }
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Load artwork data to get pricing and details
const artworks = require('../../content/artworks.json');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { artworkId, variant } = JSON.parse(event.body);

    if (!artworkId || !variant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing artworkId or variant' })
      };
    }

    // Find artwork in JSON data
    const artwork = artworks.artworks.find(art => art.id === artworkId);

    if (!artwork) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Artwork not found' })
      };
    }

    // Check if artwork is available
    if (!artwork.available) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Artwork is not available for purchase' })
      };
    }

    // Get price based on variant
    const price = artwork.pricing[variant];

    if (!price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid variant or price not set' })
      };
    }

    // Build product name
    const variantNames = {
      digital: 'Digital Download',
      print8x10: '8"×10" Print',
      print16x20: '16"×20" Print',
      print24x36: '24"×36" Print'
    };

    const productName = `${artwork.title} - ${variantNames[variant]}`;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: artwork.description,
              images: [
                `${process.env.URL || 'https://jolene.taurustech.me'}${artwork.images.og}`
              ],
              metadata: {
                artworkId: artwork.id,
                variant: variant,
                artist: 'Jolene Casko'
              }
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL || event.headers.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || event.headers.origin}/shop.html`,
      metadata: {
        artworkId: artwork.id,
        variant: variant,
        artworkTitle: artwork.title
      },
      // Add shipping for physical prints
      ...(variant !== 'digital' && {
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'JP', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'IE', 'AT', 'CH'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1000, // $10 domestic shipping
                currency: 'usd',
              },
              display_name: 'Standard Shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 5,
                },
                maximum: {
                  unit: 'business_day',
                  value: 7,
                },
              },
            },
          },
        ],
      }),
      // Customer email collection
      customer_email: event.queryStringParameters?.email || undefined,
      billing_address_collection: 'required',
      // Custom text
      custom_text: {
        submit: {
          message: 'Thank you for supporting independent art!'
        }
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Stripe session creation error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message
      })
    };
  }
};
