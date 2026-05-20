const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const parseBody = (body) => {
  try {
    return JSON.parse(body || '{}');
  } catch {
    return null;
  }
};

const sanitizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const splitName = (firstName, lastName, fullName) => {
  const first = sanitizeString(firstName);
  const last = sanitizeString(lastName);
  if (first || last) return { firstName: first, lastName: last };

  const parts = sanitizeString(fullName).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ')
  };
};

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: jsonHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const payload = parseBody(event.body);
  if (!payload) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Invalid JSON payload' })
    };
  }

  const { firstName, lastName } = splitName(payload.firstName, payload.lastName, payload.fullName);
  const email = sanitizeString(payload.email);
  const phone = sanitizeString(payload.phone);
  const website = sanitizeString(payload.website);
  const address = sanitizeString(payload.address);
  const revenue = sanitizeString(payload.revenue);
  const businessType = sanitizeString(payload.businessType);
  const message = sanitizeString(payload.message);

  if (!firstName || !email || !phone || !businessType || !message) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Missing required lead fields' })
    };
  }

  if (!validEmail(email)) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Invalid email address' })
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID || '43ttz135eUcQq32zMJUv';

  if (!apiKey || !locationId) {
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Missing GHL credentials' })
    };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const tags = [
    'Website Lead',
    'Infinite Automationz',
    businessType && `industry_${businessType.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`
  ].filter(Boolean);

  const contactPayload = {
    firstName,
    lastName,
    email,
    phone,
    locationId,
    source: 'Infinite Automationz Website',
    tags
  };

  if (website) contactPayload.website = website;
  if (address) contactPayload.address1 = address;

  try {
    const contactResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers,
      body: JSON.stringify(contactPayload)
    });

    if (!contactResponse.ok) {
      const details = await contactResponse.text();
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: 'Failed to create/update contact', details })
      };
    }

    const contactBody = await contactResponse.json();
    const contactId = contactBody?.contact?.id || contactBody?.id || null;

    if (contactId) {
      const noteSections = [
        'Infinite Automationz website consultation request',
        `Name: ${[firstName, lastName].filter(Boolean).join(' ')}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        website && `Website: ${website}`,
        address && `Address: ${address}`,
        revenue && `Estimated monthly revenue: ${revenue}`,
        businessType && `Business type: ${businessType}`,
        message && `Automation priority: ${message}`
      ].filter(Boolean);

      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: noteSections.join('\n') })
      });
    }

    if (process.env.GHL_PIPELINE_ID && process.env.GHL_PIPELINE_STAGE_ID && contactId) {
      await fetch('https://services.leadconnectorhq.com/opportunities/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contactId,
          locationId,
          pipelineId: process.env.GHL_PIPELINE_ID,
          pipelineStageId: process.env.GHL_PIPELINE_STAGE_ID,
          name: `${[firstName, lastName].filter(Boolean).join(' ')} — Infinite Automationz Lead`,
          status: 'open'
        })
      });
    }

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ ok: true, contactId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Server error', details: error.message })
    };
  }
};
