const STORAGE_KEY='shattered-ages-prototype-v1';

export const defaultState=()=>({
  food:500,timber:400,stone:250,clay:150,iron:80,population:24,
  progress:18,power:18,completedUpgrades:[],discovered:['home'],ruinExposed:false,
  lastScoutReport:'',heroFocus:'Mara Keln',
  relics:[],
  expedition:{started:false,supplies:3,danger:18,progress:0,resonance:0,completed:false,log:[]},
  battle:{unlocked:false,resolved:false,victory:false,rewardClaimed:false,playerForces:46,enemyForces:26,log:[]},
  worldBattles:{
    selected:null,
    'broken-pike-camp':{resolved:false,victory:false,rewardClaimed:false,playerForces:38,enemyForces:19,log:[]},
    'grey-banner-patrol':{resolved:false,victory:false,rewardClaimed:false,playerForces:38,enemyForces:28,log:[]}
  }
});

export function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return defaultState();
    const parsed=JSON.parse(raw);
    const fresh=defaultState();
    const parsedWorld=parsed.worldBattles||{};
    return {
      ...fresh,...parsed,
      expedition:{...fresh.expedition,...(parsed.expedition||{})},
      battle:{...fresh.battle,...(parsed.battle||{})},
      worldBattles:{
        ...fresh.worldBattles,...parsedWorld,
        'broken-pike-camp':{...fresh.worldBattles['broken-pike-camp'],...(parsedWorld['broken-pike-camp']||{})},
        'grey-banner-patrol':{...fresh.worldBattles['grey-banner-patrol'],...(parsedWorld['grey-banner-patrol']||{})}
      }
    };
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

const heroStats={
  'Sera Vale':{command:7,scouting:3,knowledge:2,engineering:2,resonance:1},
  'Orin Thess':{command:3,scouting:8,knowledge:4,engineering:2,resonance:2},
  'Mara Keln':{command:2,scouting:2,knowledge:5,engineering:9,resonance:1},
  'Ilya Ren':{command:1,scouting:4,knowledge:9,engineering:3,resonance:6}
};

export function beginRuinExpedition(state){
  if(!state.ruinExposed)return false;
  state.expedition.started=true;
  if(!state.expedition.log.length)state.expedition.log.push('The expedition descends beneath Ashfall Hold. The walls have no visible seams.');
  saveState(state);return true;
}

export function resolveRuinChoice(state,choice){
  const expedition=state.expedition;
  if(!state.ruinExposed||!expedition.started||expedition.completed||expedition.supplies<=0)return {changed:false,message:'The expedition cannot proceed.'};
  const h=heroStats[state.heroFocus]||heroStats['Mara Keln'];
  expedition.supplies-=1;
  if(choice==='listen'){
    expedition.progress=Math.min(100,expedition.progress+14+h.knowledge*2+h.resonance*3);
    expedition.resonance+=8+h.resonance*2;
    expedition.danger=Math.max(0,expedition.danger-Math.max(2,h.knowledge));
    expedition.log.push(`${state.heroFocus} studies the chamber pulse without disturbing it.`);
  }else if(choice==='force-door'){
    expedition.progress=Math.min(100,expedition.progress+20+h.command+h.engineering*2);
    expedition.danger+=Math.max(3,12-h.engineering);
    expedition.log.push(`${state.heroFocus} forces the sealed threshold.`);
  }else if(choice==='trace-signal'){
    expedition.progress=Math.min(100,expedition.progress+18+h.scouting*2+h.resonance*2);
    expedition.resonance+=12+h.resonance;
    expedition.danger+=Math.max(1,7-h.scouting);
    expedition.log.push(`${state.heroFocus} traces the impossible signal deeper below.`);
  }else return {changed:false,message:'Unknown expedition choice.'};

  if(expedition.progress>=100){
    expedition.completed=true;
    state.battle.unlocked=true;
    if(!state.relics.includes('Meridian Lens')){
      state.relics.push('Meridian Lens');state.iron+=25;state.stone+=40;state.power+=5;
    }
    expedition.log.push('A dormant mechanism answers. For one heartbeat, another world appears beyond the chamber.');
    expedition.log.push('Then something wakes between the expedition and the exit.');
  }
  saveState(state);
  return {changed:true,message:expedition.completed?'The Buried Meridian is breached. A guardian blocks the return route.':`Progress ${expedition.progress}%. Danger ${expedition.danger}. Supplies ${expedition.supplies}.`};
}

export function resolveGuardianBattle(state){
  if(!state.battle.unlocked||state.battle.resolved)return {changed:false,message:'No unresolved guardian encounter.'};
  const h=heroStats[state.heroFocus]||heroStats['Mara Keln'];
  const playerScore=state.battle.playerForces*2+state.power+h.command*5+h.engineering*2;
  const enemyScore=state.battle.enemyForces*2+38;
  const victory=playerScore>=enemyScore;
  state.battle.resolved=true;state.battle.victory=victory;
  state.battle.playerForces=Math.max(1,Math.round(state.battle.playerForces*(victory?.82:.58)));
  state.battle.enemyForces=Math.max(0,Math.round(state.battle.enemyForces*(victory?.35:.74)));
  state.battle.log.push(`${state.heroFocus} leads Ashfall's force against the Meridian Guardian.`);
  state.battle.log.push(victory?'The guardian fractures and the route home opens.':'The expedition is forced back under heavy pressure.');
  if(victory&&!state.battle.rewardClaimed){state.battle.rewardClaimed=true;state.iron+=20;state.food+=35;state.power+=4;state.relics.push('Guardian Shard')}
  saveState(state);
  return {changed:true,message:victory?'Victory. Guardian Shard recovered.':'Defeat. The party survives, but the guardian still controls the threshold.'};
}

const worldBattleDefs={
  'broken-pike-camp':{name:'Broken Pike Camp',enemy:'Broken Pike Raiders',enemyBase:19,reward:{food:30,timber:20,iron:8,power:2}},
  'grey-banner-patrol':{name:'Grey Banner Patrol',enemy:'Grey Banner Patrol',enemyBase:28,reward:{food:22,stone:18,iron:12,power:3}}
};

export function prepareWorldBattle(state,id){
  if(!worldBattleDefs[id]||!state.discovered.includes(id==='broken-pike-camp'?'enemy-1':'enemy-2'))return false;
  state.worldBattles.selected=id;saveState(state);return true;
}

export function resolveWorldBattle(state,id){
  const def=worldBattleDefs[id],encounter=state.worldBattles[id];
  if(!def||!encounter||encounter.resolved)return {changed:false,message:'No unresolved field encounter.'};
  const h=heroStats[state.heroFocus]||heroStats['Mara Keln'];
  const playerScore=encounter.playerForces*2+state.power+h.command*5+h.scouting*2;
  const enemyScore=encounter.enemyForces*2+(id==='grey-banner-patrol'?32:20);
  const victory=playerScore>=enemyScore;
  encounter.resolved=true;encounter.victory=victory;
  encounter.playerForces=Math.max(1,Math.round(encounter.playerForces*(victory?.86:.66)));
  encounter.enemyForces=Math.max(0,Math.round(encounter.enemyForces*(victory?.28:.76)));
  encounter.log.push(`${state.heroFocus} leads the Ashfall field force against ${def.enemy}.`);
  encounter.log.push(victory?`${def.name} is cleared and the road is safer.`:`Ashfall's troops withdraw before the field force is destroyed.`);
  if(victory&&!encounter.rewardClaimed){
    encounter.rewardClaimed=true;
    for(const [key,value] of Object.entries(def.reward))state[key]=(state[key]||0)+value;
  }
  saveState(state);
  return {changed:true,message:victory?`Victory at ${def.name}. Supplies recovered.`:`Defeat at ${def.name}. Survivors returned to Ashfall Hold.`};
}
