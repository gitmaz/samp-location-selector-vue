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

export async function reverseGeocode({ latitude, longitude }) {
  const url = new URL(`${base}/geocode/reverse`, window.location.origin);
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) await parseError(res);
  return res.json();
}

