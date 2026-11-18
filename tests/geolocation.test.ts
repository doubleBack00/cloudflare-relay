import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';

import { setClientLocationHeaders } from '../src/geolocation.ts';

test('relay signatures match the API HMAC protocol and replace spoofed headers', async () => {
  const headers = new Headers({
    'X-Client-IP': 'spoofed',
    'X-Client-Timestamp': 'spoofed',
    'X-Client-Signature': 'spoofed',
  });
  await setClientLocationHeaders(headers, '8.8.8.8', 'test-relay-secret');
  const timestamp = headers.get('X-Client-Timestamp');
  const expected = createHmac('sha256', 'test-relay-secret')
    .update(`${timestamp}:8.8.8.8`)
    .digest('hex');
  assert.equal(headers.get('X-Client-IP'), '8.8.8.8');
  assert.equal(headers.get('X-Client-Signature'), expected);
  assert.ok(Math.abs(Date.now() / 1000 - Number(timestamp)) < 2);
});

test('relay removes spoofed attribution when signing is not configured', async () => {
  const headers = new Headers({
    'X-Client-IP': '8.8.8.8',
    'X-Client-Timestamp': '123',
    'X-Client-Signature': 'spoofed',
  });
  await setClientLocationHeaders(headers, '1.1.1.1');
  assert.equal(headers.get('X-Client-IP'), null);
  assert.equal(headers.get('X-Client-Timestamp'), null);
  assert.equal(headers.get('X-Client-Signature'), null);
});
