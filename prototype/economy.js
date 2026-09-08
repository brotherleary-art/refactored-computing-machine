export const MAX_OFFLINE_SECONDS=4*60*60;
const resources=['food','timber','stone','clay','iron'];

export function prototypeCapacity(state){
  const storeLevel=state.completedUpgrades?.includes('store')?1:0;
  const cap=300+storeLevel*200;
  return Object.fromEntries(resources.map(k=>[k,cap]));
}

export function prototypeRates(state){
  return {
    food:state.completedUpgrades?.includes('farm')?.8:0,
    timber:state.completedUpgrades?.includes('lumber')?.65:0,
    stone:state.completedUpgrades?.includes('quarry')?.45:0,
    clay:state.completedUpgrades?.includes('clayPit')?.35:0,
    iron:state.completedUpgrades?.includes('ironMine')?.18:0
  };
}

export function applyPrototypeEconomy(state,now=Date.now()){
  const last=Number.isFinite(state.lastEconomyAt)?state.lastEconomyAt:now;
  const elapsed=Math.min(MAX_OFFLINE_SECONDS,Math.max(0,(now-last)/1000));
  const capacity=prototypeCapacity(state),rates=prototypeRates(state);
  for(const k of resources)state[k]=Math.min(capacity[k],(state[k]||0)+rates[k]*elapsed);
  state.lastEconomyAt=now;
  return {state,elapsedSeconds:elapsed,capacity,rates};
}

export function economySummary(state){
  const capacity=prototypeCapacity(state),rates=prototypeRates(state);
  const active=resources.filter(k=>rates[k]>0).map(k=>`${k} +${rates[k].toFixed(2)}/s`);
  return {capacity:capacity.food,active:active.length?active.join(' • '):'Repair producers to start passive income'};
}
