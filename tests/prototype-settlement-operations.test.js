import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('settlement operations visual', () => {
  it('shows upkeep, construction crew, exploration intel, combat claim, and entitlement status', () => {
    const html = readFileSync(new URL('../prototype/settlement-operations.html', import.meta.url), 'utf8');
    expect(html).toContain('Settlement Operations');
    expect(html).toContain('Food Upkeep');
    expect(html).toContain('Construction Crew');
    expect(html).toContain('Exploration Intel');
    expect(html).toContain('Combat Reward Claim');
    expect(html).toContain('Test Entitlement');
  });
});
