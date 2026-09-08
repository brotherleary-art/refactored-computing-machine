import { describe, expect, it } from 'vitest';
import { applySaveWrite, chooseNewestSave } from '../src/game/saveSync.js';

describe('save sync',()=>{
  it('increments revision on a valid write',()=>{
    const current={playerId:'p1',revision:3,updatedAt:100,payload:{food:10}};
    expect(applySaveWrite(current,{playerId:'p1',expectedRevision:3,payload:{food:20}},200)).toEqual({playerId:'p1',revision:4,updatedAt:200,payload:{food:20}});
  });
  it('rejects stale clients instead of overwriting newer progress',()=>{
    const current={playerId:'p1',revision:3,updatedAt:100,payload:{food:10}};
    expect(()=>applySaveWrite(current,{playerId:'p1',expectedRevision:2,payload:{food:999}},200)).toThrow('SAVE_REVISION_CONFLICT');
  });
  it('chooses the highest revision during recovery',()=>{
    const local={playerId:'p1',revision:5,updatedAt:500,payload:{food:50}};
    const remote={playerId:'p1',revision:6,updatedAt:450,payload:{food:40}};
    expect(chooseNewestSave(local,remote)).toBe(remote);
  });
});
