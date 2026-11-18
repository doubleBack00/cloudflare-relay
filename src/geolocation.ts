export const setClientLocationHeaders = async (
  headers: Headers,
  clientIp: string | null,
  secret?: string,
): Promise<void> => {
  headers.delete('X-Client-IP');
  headers.delete('X-Client-Timestamp');
  headers.delete('X-Client-Signature');

  if (!secret || !clientIp) {
    return;
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${timestamp}:${clientIp}`),
  );
  const hex = Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  headers.set('X-Client-IP', clientIp);
  headers.set('X-Client-Timestamp', timestamp);
  headers.set('X-Client-Signature', hex);
};
