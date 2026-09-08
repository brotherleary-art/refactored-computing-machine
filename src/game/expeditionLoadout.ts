import type { ResourceWallet } from './resources.js';

export type ExpeditionSupply = 'rations' | 'rope' | 'lanternOil' | 'medicalKit';

export interface LoadoutRequest { supply: ExpeditionSupply; quantity: number }
export interface ExpeditionLoadout { requests: LoadoutRequest[]; totalSlots: number; cost: Partial<ResourceWallet> }

const SUPPLIES: Record<ExpeditionSupply,{slots:number;cost:Partial<ResourceWallet>}> = {
  rations:{slots:1,cost:{food:12}}, rope:{slots:1,cost:{timber:8}}, lanternOil:{slots:1,cost:{clay:4,iron:2}}, medicalKit:{slots:2,cost:{food:8,clay:6}}
};

export function expeditionCapacity(expeditionHallLevel:number, scoutLodgeLevel:number):number {
  return 4 + Math.max(0, expeditionHallLevel) * 2 + Math.floor(Math.max(0, scoutLodgeLevel) / 2);
}

export function planExpeditionLoadout(requests:LoadoutRequest[], wallet:ResourceWallet, expeditionHallLevel:number, scoutLodgeLevel:number):ExpeditionLoadout {
  const normalized = requests.filter((r)=>r.quantity>0 && Number.isInteger(r.quantity));
  const totalSlots = normalized.reduce((sum,r)=>sum + SUPPLIES[r.supply].slots*r.quantity,0);
  if(totalSlots>expeditionCapacity(expeditionHallLevel,scoutLodgeLevel)) throw new Error('LOADOUT_CAPACITY_EXCEEDED');
  const cost:Partial<ResourceWallet>={};
  for(const req of normalized){
    for(const [resource,amount] of Object.entries(SUPPLIES[req.supply].cost)){
      const key=resource as keyof ResourceWallet;
      cost[key]=(cost[key]??0)+(amount??0)*req.quantity;
    }
  }
  for(const [resource,amount] of Object.entries(cost)) if(wallet[resource as keyof ResourceWallet]<(amount??0)) throw new Error('INSUFFICIENT_SUPPLIES');
  return {requests:normalized,totalSlots,cost};
}
