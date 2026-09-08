import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../prototype/vertical-slice-command.html', import.meta.url), 'utf8');

describe('integrated vertical slice command visual', () => {
  it('exposes the five newly verified systems', () => {
    expect(html).toContain('Settlement morale');
    expect(html).toContain('Building unlock');
    expect(html).toContain('Overland route');
    expect(html).toContain('Battle aftermath');
    expect(html).toContain('Revenue readiness');
  });

  it('states test-commerce safety boundaries visibly', () => {
    expect(html).toContain('TEST MODE ONLY');
    expect(html).toContain('NO COMBAT POWER');
    expect(html).toContain('LIVE CHARGES DISABLED');
  });
});
