import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../prototype/revenue-readiness.html', import.meta.url), 'utf8');

describe('revenue readiness prototype', () => {
  it('visibly identifies sandbox-only entitlement reconciliation and anti-pay-to-win rules', () => {
    expect(html).toContain('Revenue Readiness');
    expect(html).toContain('SANDBOX ONLY');
    expect(html).toContain('Live charges disabled');
    expect(html).toContain('No combat-power entitlements');
    expect(html).toContain('Reconciliation ledger');
  });
});
