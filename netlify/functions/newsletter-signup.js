/**
 * Netlify Serverless Function: Mailchimp Newsletter Signup
 *
 * Adds email subscribers to Mailchimp list
 *
 * Environment Variables Required:
 * - MAILCHIMP_API_KEY: Your Mailchimp API key
 * - MAILCHIMP_LIST_ID: Your Mailchimp audience/list ID
 * - MAILCHIMP_SERVER_PREFIX: Server prefix (e.g., us1, us19)
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, firstName, source } = JSON.parse(event.body);

    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Valid email address required' })
      };
    }

    // Check if Mailchimp is configured
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      console.log('Mailchimp not configured, logging signup:', email);

      // For now, just log the signup
      // In production, you'd want to save to a database or send notification
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          message: 'Thank you for subscribing! (Mailchimp configuration pending)'
        })
      };
    }

    // Add to Mailchimp
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1';
    const listId = process.env.MAILCHIMP_LIST_ID;
    const apiKey = process.env.MAILCHIMP_API_KEY;

    const mailchimpUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;

    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName || '',
          SOURCE: source || 'website'
        },
        tags: ['website-signup']
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          message: 'Successfully subscribed to newsletter!'
        })
      };
    } else {
      // Handle Mailchimp errors
      if (data.title === 'Member Exists') {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'This email is already subscribed!'
          })
        };
      }

      throw new Error(data.detail || 'Mailchimp error');
    }

  } catch (error) {
    console.error('Newsletter signup error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to subscribe. Please try again later.',
        details: error.message
      })
    };
  }
};

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
