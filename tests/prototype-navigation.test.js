import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hold = read('prototype/index.html');
const council = read('prototype/war-council.html');
const training = read('prototype/training.js');

describe('prototype military navigation and training UX', () => {
  it('links Ashfall Hold directly to the War Council and shows military queue status', () => {
    expect(hold).toContain('href="war-council.html"');
    expect(hold).toContain('Trained field force');
    expect(hold).toContain('Training queue');
  });

  it('shows a visible timed training queue with building prerequisites', () => {
    expect(council).toContain('Training Queue');
    expect(council).toContain("from'./training.js'");
    expect(council).toContain('Requires ${u.building}');
    expect(council).toContain('Ready in ${queueCountdown(o)}s');
  });

  it('keeps advanced troop access behind settlement progression gates', () => {
    expect(training).toContain("progress||0)>=70");
    expect(training).toContain("progress||0)>=85&&state.relics?.includes('Guardian Shard')");
    expect(training).toContain("Requires ${unit.building}");
  });
});
