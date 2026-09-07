import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('prototype settlement economy UX', () => {
  it('shows capped storage and offline production in Ashfall Hold', () => {
    const hold = read('prototype/index.html');
    const economy = read('prototype/economy.js');
    expect(hold).toContain("from'./economy.js'");
    expect(hold).toContain('Storage capacity');
    expect(hold).toContain('Offline production');
    expect(economy).toContain('MAX_OFFLINE_SECONDS');
    expect(economy).toContain('Math.min(capacity[k]');
  });
});
