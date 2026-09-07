export type ResearchId = 'field_rotation' | 'charcoal_bloom' | 'reinforced_masonry' | 'trail_marking' | 'field_medicine' | 'resonance_notation';

export interface ResearchNode {
  id: ResearchId;
  name: string;
  knowledgeCost: number;
  prerequisites: ResearchId[];
  effect: string;
}

export const RESEARCH_NODES: ResearchNode[] = [
  { id: 'field_rotation', name: 'Field Rotation', knowledgeCost: 40, prerequisites: [], effect: '+10% food production' },
  { id: 'charcoal_bloom', name: 'Charcoal Bloom', knowledgeCost: 55, prerequisites: [], effect: 'Unlocks efficient ironworking' },
  { id: 'trail_marking', name: 'Trail Marking', knowledgeCost: 45, prerequisites: [], effect: '-10% scouting travel time' },
  { id: 'reinforced_masonry', name: 'Reinforced Masonry', knowledgeCost: 90, prerequisites: ['charcoal_bloom'], effect: '+10 regional defense' },
  { id: 'field_medicine', name: 'Field Medicine', knowledgeCost: 75, prerequisites: ['field_rotation'], effect: '-10% battle casualties' },
  { id: 'resonance_notation', name: 'Resonance Notation', knowledgeCost: 110, prerequisites: ['trail_marking'], effect: '+1 ruin insight tier' },
];

const nodeById = new Map(RESEARCH_NODES.map((node) => [node.id, node]));

export function canResearch(id: ResearchId, completed: ResearchId[], knowledge: number): boolean {
  const node = nodeById.get(id);
  return Boolean(node && !completed.includes(id) && knowledge >= node.knowledgeCost && node.prerequisites.every((req) => completed.includes(req)));
}

export function completeResearch(id: ResearchId, completed: ResearchId[], knowledge: number) {
  if (!canResearch(id, completed, knowledge)) throw new Error(`Research ${id} is not currently available.`);
  const node = nodeById.get(id)!;
  return { completed: [...completed, id], knowledge: knowledge - node.knowledgeCost };
}
