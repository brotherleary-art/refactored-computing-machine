const STORAGE_KEY='shattered-ages-prototype-v1';

export const defaultState=()=>({
  food:500,timber:400,stone:250,clay:150,iron:80,population:24,
  progress:18,power:18,completedUpgrades:[],discovered:['home'],ruinExposed:false,
  lastScoutReport:'',heroFocus:'Mara Vey'
});

export function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return defaultState();
    return {...defaultState(),...JSON.parse(raw)};
  }catch{return defaultState()}
}

export function saveState(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return state}
export function resetState(){const fresh=defaultState();saveState(fresh);return fresh}

export function completeUpgrade(state,id){
  if(state.completedUpgrades.includes(id))return state;
  if(state.timber<40||state.stone<20)return state;
  state.timber-=40;state.stone-=20;state.progress=Math.min(100,state.progress+12);state.power+=2;
  state.completedUpgrades.push(id);saveState(state);return state;
}

export function exposeRuin(state){
  if(state.ruinExposed||state.progress<55)return false;
  state.ruinExposed=true;state.progress=Math.min(100,state.progress+20);state.iron+=15;saveState(state);return true;
}

export function discover(state,id,report,reward={}){
  const first=!state.discovered.includes(id);
  if(first){state.discovered.push(id);for(const [key,value] of Object.entries(reward)){state[key]=(state[key]||0)+value}}
  state.lastScoutReport=report;saveState(state);return first;
}
