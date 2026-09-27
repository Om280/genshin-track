import {talentSkillIds} from '../data/talentSkillIds.js';
export const TALENT_IDS=['normal','skill','burst'];
export const TALENT_LABELS={normal:'NORMAL ATTACK',skill:'ELEMENTAL SKILL',burst:'ELEMENTAL BURST'};

// Four distinct, source-aware UI states; 0 is never treated as a valid talent level.
export function talentState(recommendation){
  if(!recommendation||!recommendation.priority||!recommendation.sourceUrl)return {kind:'unavailable',target:null,priority:null,description:'No verified talent recommendation is currently available.'};
  if(recommendation.priority==='CONTEXTUAL')return {kind:'unavailable',target:null,priority:null,description:'Source priorities differ by playstyle; no single priority or numeric target is verified for this build.'};
  if(recommendation.priority==='AUTOMATIC')return {kind:'automatic',target:null,priority:'AUTOMATIC',description:'This character’s Talents level automatically with character progress; no separate Talent-material target.'};
  const level=recommendation.recommendedLevel;
  const specified=recommendation.levelSpecified===true&&Number.isInteger(level)&&level>=1&&level<=15&&!!recommendation.levelSource;
  if(specified)return {kind:level===1&&recommendation.priority==='LOW'?'not-required':'numeric',target:level,priority:recommendation.priority,description:level===1&&recommendation.priority==='LOW'?'Level 1 is sufficient for this build.':'Recommended target level.'};
  return {kind:'priority-only',target:null,priority:recommendation.priority,description:'Numeric target not specified by source.'};
}
export function currentTalentLevel(showcase,characterId,talentId){
  const index=TALENT_IDS.indexOf(talentId),skillId=talentSkillIds[String(characterId)]?.[index];
  if(!skillId)return null;
  const level=showcase?.skillLevelMap?.[skillId];
  return Number.isInteger(Number(level))&&Number(level)>0?Number(level):null;
}
export function initialTalentTargets(guide){
  const targets={};for(const id of TALENT_IDS){const rec=guide?.variants?.[0]?.talents?.find(t=>t.talentId===id);const state=talentState(rec);targets[id]=state.target}
  return targets;
}
