// ASK 607 build (W4): a gate change the engine cannot read as any line form is recorded, not counted (as ASK 549). Shared Library only, engine and child (same LIB).
// Base: live engine 94b682a0 and child b9cd4e5c (base_*.json, fetched 16:1x CST 11-24). One LIB line: the sbApply2024 form-refusal push gains rfs:'pkgFRM'.
const fs=require('fs');const {apply}=require('/mnt/project-files/ask586/w4/build/libpatch.js');
const A="why:'the CHANGE TO line has no line form the engine reads'+__rtH,to,lines:[o]});";
const B="why:'the CHANGE TO line has no line form the engine reads'+__rtH,to,lines:[o],rfs:'pkgFRM'/* ASK 607: a gate change in no line form is recorded, not counted, as ASK 549 */});";
for(const [src,out,vid] of [['base_moMxiV4Irg1uRBZN.json','target_engine_607.json','94b682a0-5ebb-4c8b-9a9d-880080048847'],['base_MqQHRl7mQQ0z8QdT.json','target_child_607.json','b9cd4e5c-9758-47ad-abd2-7aef9d56f1a1']]){
 const W=JSON.parse(fs.readFileSync(__dirname+'/'+src,'utf8'));if(W.versionId!==vid)throw new Error(src+' is not '+vid);
 const r=apply(W,[{line:null,a:A,b:B,what:'ASK 607 pkgFRM mark'}]);fs.writeFileSync(__dirname+'/'+out,JSON.stringify(W));console.log(out,JSON.stringify(r));}
