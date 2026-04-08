const base = '/api';

async function parseError(res) {
  let message = res.statusText;
  try {
    const body = await res.json();
    if (body.message) message = body.message;
    else if (body.errors?.length) message = body.errors.map((e) => e.msg).join(', ');
  } catch {
    /* ignore */
  }
  throw new Error(message);
}

export async function listLocations() {
  const res = await fetch(`${base}/locations`);
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function createLocation({ latitude, longitude, address }) {
  const res = await fetch(`${base}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude,
      longitude,
      ...(address ? { address } : {}),
    }),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function deleteLocation(id) {
  const res = await fetch(`${base}/locations/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) await parseError(res);
}
