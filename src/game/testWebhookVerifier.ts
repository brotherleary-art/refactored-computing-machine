export interface TestWebhookEvent {
  id: string;
  mode: 'test' | 'live';
  type: 'checkout.completed' | 'subscription.renewed' | 'purchase.refunded';
  playerId: string;
  offerId: string;
  signature: string;
}

export interface VerifiedWebhookEvent extends Omit<TestWebhookEvent, 'signature'> {
  verified: true;
}

export function expectedTestSignature(secret: string, event: Omit<TestWebhookEvent, 'signature'>): string {
  const raw = `${secret}|${event.id}|${event.type}|${event.playerId}|${event.offerId}|${event.mode}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function verifyTestWebhook(event: TestWebhookEvent, secret: string): VerifiedWebhookEvent {
  if (event.mode !== 'test') throw new Error('LIVE_COMMERCE_DISABLED');
  if (!secret) throw new Error('TEST_WEBHOOK_SECRET_REQUIRED');
  const { signature, ...unsigned } = event;
  if (signature !== expectedTestSignature(secret, unsigned)) throw new Error('INVALID_WEBHOOK_SIGNATURE');
  return { ...unsigned, verified: true };
}

export function acceptWebhookOnce(event: VerifiedWebhookEvent, processedIds: Set<string>): boolean {
  if (processedIds.has(event.id)) return false;
  processedIds.add(event.id);
  return true;
}
