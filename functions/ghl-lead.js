const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const validPrimaryGoals = new Set([
  'lose_weight',
  'build_muscle',
  'general_fitness',
  'other'
]);

const validMealInterest = new Set(['yes', 'no', 'tell_me_more']);

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

  const firstName = sanitizeString(payload.firstName);
  const lastName = sanitizeString(payload.lastName);
  const email = sanitizeString(payload.email);
  const phone = sanitizeString(payload.phone);
  const primaryGoal = sanitizeString(payload.primaryGoal);
  const mealInterest = sanitizeString(payload.mealInterest);
  const referralSource = sanitizeString(payload.referralSource);
  const sourceForm = sanitizeString(payload.sourceForm) || 'unknown';
  const utm = payload.utm && typeof payload.utm === 'object' ? payload.utm : {};

  if (!firstName || !lastName || !email || !phone || !primaryGoal || !mealInterest || !referralSource) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  if (!validPrimaryGoals.has(primaryGoal)) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Invalid primaryGoal value' })
    };
  }

  if (!validMealInterest.has(mealInterest)) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Invalid mealInterest value' })
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

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

  const contactPayload = {
    firstName,
    lastName,
    email,
    phone,
    locationId,
    source: 'Justin Robinson Website Lead',
    tags: [
      'Website Lead',
      'Justin Robinson',
      `goal_${primaryGoal}`,
      `meal_${mealInterest}`,
      `form_${sourceForm}`
    ]
  };

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
        'Website intake submission',
        `Form context: ${sourceForm}`,
        `Primary goal: ${primaryGoal}`,
        `Meal prep interest: ${mealInterest}`,
        `Referral source: ${referralSource}`
      ];

      const utmEntries = Object.entries(utm).filter(([, value]) => typeof value === 'string' && value.trim() !== '');
      if (utmEntries.length) {
        noteSections.push(
          'UTM:',
          ...utmEntries.map(([key, value]) => `${key}: ${value}`)
        );
      }

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
          name: `${firstName} ${lastName}`.trim(),
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
