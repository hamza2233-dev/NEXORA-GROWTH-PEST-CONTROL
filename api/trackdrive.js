export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, caller_id, ping_id } = req.body;

  if (!caller_id) {
    return res.status(400).json({ error: 'Missing required caller_id' });
  }

  let targetUrl = '';
  let payload = {
    trackdrive_number: "+18444404558",
    traffic_source_id: "4050",
    caller_id: caller_id
  };

  if (action === 'ping') {
    targetUrl = 'https://revenueclickmedia-com.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_agent_on_pest';
  } else if (action === 'post') {
    if (!ping_id) {
      return res.status(400).json({ error: 'Missing required ping_id for posting' });
    }
    targetUrl = 'https://revenueclickmedia-com.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_agent_on_pest';
    payload.ping_id = ping_id;
  } else {
    return res.status(400).json({ error: 'Invalid action specified' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();
    return res.status(200).send(resultText);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
