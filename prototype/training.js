const definitions={
  militia:{name:'Ashfall Militia',food:12,iron:0,building:'barracks',ms:15000},
  archer:{name:'Ridge Archer',food:10,iron:2,building:'barracks',ms:20000},
  spearguard:{name:'Spearguard',food:14,iron:4,building:'barracks',ms:24000},
  scout_rider:{name:'Trail Rider',food:18,iron:3,building:'stable',ms:28000},
  sapper:{name:'Stone Sapper',food:12,iron:6,building:'forge',ms:34000},
  warden:{name:'Hold Warden',food:20,iron:10,building:'forge',ms:40000}
};

export const trainingDefinitions=definitions;

export function normalizeTrainingState(state){
  state.trainedUnits??={};
  state.trainingQueue??=[];
  return state;
}

export function availableBuildings(state){
  const built=new Set(state.completedUpgrades||[]);
  const buildings=[];
  if(built.has('barracks'))buildings.push('barracks');
  if((state.progress||0)>=70)buildings.push('stable');
  if((state.progress||0)>=85&&state.relics?.includes('Guardian Shard'))buildings.push('forge');
  return buildings;
}

export function canQueueTraining(state,id){
  normalizeTrainingState(state);
  const unit=definitions[id];
  if(!unit)return {ok:false,reason:'Unknown unit'};
  if(!availableBuildings(state).includes(unit.building))return {ok:false,reason:`Requires ${unit.building}`};
  if(state.food<unit.food||state.iron<unit.iron)return {ok:false,reason:'Need more resources'};
  return {ok:true,reason:'Ready'};
}

export function queueTraining(state,id,now=Date.now()){
  const check=canQueueTraining(state,id);if(!check.ok)return {ok:false,message:check.reason};
  const unit=definitions[id];
  state.food-=unit.food;state.iron-=unit.iron;
  const tail=state.trainingQueue.reduce((max,o)=>Math.max(max,o.readyAt),now);
  state.trainingQueue.push({id:`${id}-${now}-${state.trainingQueue.length}`,unitId:id,count:1,queuedAt:now,readyAt:tail+unit.ms});
  return {ok:true,message:`${unit.name} entered training.`};
}

export function completeReadyTraining(state,now=Date.now()){
  normalizeTrainingState(state);const completed=[];const pending=[];
  for(const order of state.trainingQueue){
    if(order.readyAt<=now){state.trainedUnits[order.unitId]=(state.trainedUnits[order.unitId]||0)+order.count;state.power+=order.count;completed.push(order)}
    else pending.push(order);
  }
  state.trainingQueue=pending;return completed;
}

export function queueCountdown(order,now=Date.now()){
  return Math.max(0,Math.ceil((order.readyAt-now)/1000));
}
