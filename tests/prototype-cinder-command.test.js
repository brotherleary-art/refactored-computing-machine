import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../prototype/cinder-command.html', import.meta.url), 'utf8');

describe('Cinder Vale command prototype', () => {
  it('shows all four expansion sites and the integrated gameplay priorities', () => {
    expect(html).toContain('Ashfall Gate');
    expect(html).toContain('Blackglass Ridge');
    expect(html).toContain('Cinder Host');
    expect(html).toContain('The Hollow Crown');
    expect(html).toContain('Repair the forward barracks');
    expect(html).toContain('Secure a supply run');
    expect(html).toContain('Advance a field hero');
    expect(html).toContain('Translate, Force, or Resonate');
  });

  it('provides a route back to the playable settlement', () => {
    expect(html).toContain('href="index.html"');
    expect(html).toContain('Ashfall Hold');
  });
});
