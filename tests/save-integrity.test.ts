import { describe, expect, it } from 'vitest';
import { createSaveEnvelope, validateSaveEnvelope } from '../src/game/saveIntegrity.js';

describe('save integrity', () => {
  it('validates an untouched save envelope', () => {
    const save = createSaveEnvelope(2, 'player-1', { food: 100, relics: ['lens'] }, 12345);
    expect(validateSaveEnvelope(save, 'player-1')).toBe(true);
  });

  it('rejects payload tampering', () => {
    const save = createSaveEnvelope(2, 'player-1', { food: 100 }, 12345);
    const tampered = { ...save, payload: { food: 999999 } };
    expect(validateSaveEnvelope(tampered, 'player-1')).toBe(false);
  });

  it('rejects a save bound to another player', () => {
    const save = createSaveEnvelope(2, 'player-1', { food: 100 }, 12345);
    expect(validateSaveEnvelope(save, 'player-2')).toBe(false);
  });
});
