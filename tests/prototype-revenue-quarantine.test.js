import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../prototype/revenue-quarantine.html', import.meta.url), 'utf8');

describe('revenue quarantine prototype', () => {
  it('shows the live-charge safety boundary and quarantine reasons', () => {
    expect(html).toContain('LIVE CHARGES DISABLED');
    expect(html).toContain('LIVE_MODE_DISABLED');
    expect(html).toContain('DUPLICATE_EVENT');
    expect(html).toContain('AMOUNT_MISMATCH');
    expect(html).toContain('Provider sandbox wired');
    expect(html).toContain('Not yet');
  });
});
