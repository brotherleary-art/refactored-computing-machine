import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const page=readFileSync(new URL('../prototype/ordinary-ruins.html',import.meta.url),'utf8');

describe('ordinary ruins prototype',()=>{
  it('offers three ordinary ruins with hero choice, supplies, danger, progress, and settlement rewards',()=>{
    expect(page).toContain('The Sunken Watch');
    expect(page).toContain('Vault of Quiet Iron');
    expect(page).toContain('Glassroot Chamber');
    expect(page).toContain('Supplies');
    expect(page).toContain('Danger');
    expect(page).toContain('Study the site');
    expect(page).toContain("from'./state.js'");
  });
});
