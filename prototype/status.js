export function regionalStatus(state){
  const guardian=state.battle;
  const broken=state.worldBattles['broken-pike-camp'];
  const grey=state.worldBattles['grey-banner-patrol'];
  const battles=[guardian,broken,grey];
  const clearedThreats=battles.filter(b=>b.resolved&&b.victory).length;
  const survivingForces=battles.filter(b=>b.resolved).reduce((sum,b)=>sum+Math.max(0,b.playerForces),0);
  const safetyScore=Math.min(100,18+clearedThreats*24+Math.min(10,Math.floor(survivingForces/8)));
  const tier=safetyScore>=72?'secured':safetyScore>=42?'contested':'fractured';
  const roadsSecured=broken.resolved&&broken.victory&&grey.resolved&&grey.victory;
  const summary=tier==='secured'
    ?'Ashfall March is locally secured. Trade and civilian movement can resume under guard.'
    :tier==='contested'
      ?'Ashfall March is contested. Patrols hold some routes, but hostile movement remains.'
      :'Ashfall March is fractured. Roads remain dangerous and Ashfall Hold is strategically isolated.';
  return{clearedThreats,survivingForces,safetyScore,tier,roadsSecured,summary};
}

export function currentObjective(state){
  const steps=[
    [state.progress>=55,'Stabilize Ashfall Hold'],
    [state.ruinExposed,'Open the Buried Meridian'],
    [state.expedition.completed,'Recover the Meridian Lens'],
    [state.battle.resolved&&state.battle.victory,'Defeat the Meridian Guardian'],
    [state.worldBattles['broken-pike-camp'].resolved&&state.worldBattles['broken-pike-camp'].victory&&state.worldBattles['grey-banner-patrol'].resolved&&state.worldBattles['grey-banner-patrol'].victory,'Clear both hostile road forces']
  ];
  const next=steps.find(([done])=>!done);
  return next?next[1]:'Prepare Ashfall for regional expansion';
}
