import { describe, expect, it } from 'vitest';
import { applyCommerceEvent, commerceChangesCombatPower } from '../src/game/commerceLedger.js';

describe('commerce ledger',()=>{
  const base={processedEventIds:[],activeEntitlements:[]};
  it('grants and revokes a verified test entitlement',()=>{
    const granted=applyCommerceEvent(base,{eventId:'evt-1',playerId:'p1',entitlementId:'founder-bronze',type:'purchase',verified:true,testMode:true});
    expect(granted.activeEntitlements).toEqual(['founder-bronze']);
    const refunded=applyCommerceEvent(granted,{eventId:'evt-2',playerId:'p1',entitlementId:'founder-bronze',type:'refund',verified:true,testMode:true});
    expect(refunded.activeEntitlements).toEqual([]);
  });
  it('rejects replayed and live-mode events',()=>{
    const granted=applyCommerceEvent(base,{eventId:'evt-1',playerId:'p1',entitlementId:'founder-bronze',type:'purchase',verified:true,testMode:true});
    expect(()=>applyCommerceEvent(granted,{eventId:'evt-1',playerId:'p1',entitlementId:'founder-bronze',type:'renewal',verified:true,testMode:true})).toThrow('COMMERCE_REPLAY');
    expect(()=>applyCommerceEvent(base,{eventId:'evt-live',playerId:'p1',entitlementId:'founder-gold',type:'purchase',verified:true,testMode:false})).toThrow('LIVE_COMMERCE_DISABLED');
  });
  it('never grants combat power',()=>expect(commerceChangesCombatPower()).toBe(false));
});
