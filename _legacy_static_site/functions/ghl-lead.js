const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

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

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Invalid JSON payload' })
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID || payload.locationId;

  console.log("Checking credentials...", { apiKey: apiKey ? "provided" : "MISSING", locationId: locationId ? "provided" : "MISSING" });

  if (!apiKey || !locationId) {
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Missing GHL credentials' })
    };
  }

  const contactPayload = {
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload.email || '',
    phone: payload.phone || '',
    website: payload.website || '',
    address1: payload.address || '',
    locationId,
    source: 'Website Lead',
    tags: ['Website Lead', payload.businessType].filter(Boolean)
  };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  try {
    const contactResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers,
      body: JSON.stringify(contactPayload)
    });

    if (!contactResponse.ok) {
      const errorBody = await contactResponse.text();
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: 'Failed to create/update contact', details: errorBody })
      };
    }

    const contactData = await contactResponse.json();
    const contactId = contactData?.contact?.id || contactData?.id || null;

    // Attach their form message as a note to their CRM profile
    if (contactId && (payload.message || payload.revenue)) {
      const noteBody = [
        payload.revenue ? `Est. Monthly Revenue: ${payload.revenue}` : null,
        payload.message ? `Message: ${payload.message}` : null
      ].filter(Boolean).join('\n\n');

      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: noteBody })
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
          name: `${payload.firstName || 'New'} ${payload.lastName || 'Lead'}`.trim(),
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
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
