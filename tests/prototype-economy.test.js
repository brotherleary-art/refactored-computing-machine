import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('prototype settlement economy UX', () => {
  it('shows capped storage and offline production in a playable economy panel', () => {
    const panel = read('prototype/economy.html');
    const economy = read('prototype/economy.js');
    expect(panel).toContain("from'./economy.js'");
    expect(panel).toContain('Storage capacity');
    expect(panel).toContain('Offline production');
    expect(panel).toContain('Ashfall Hold');
    expect(economy).toContain('MAX_OFFLINE_SECONDS');
    expect(economy).toContain('Math.min(capacity[k]');
  });
});
