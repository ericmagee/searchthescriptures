// J3: joint Gate Build item = VP1B rev 2 item + the pkgG4M note (as G4M adds it to live), on stored 34852 and planted variants
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/';
const S=L(P+'wall2024/fetchback_live_s119.json'),V=L(P+'w3/parent_s119_VP1B_r2.json'),G=L(P+'wall2024/parent_s119_F2r2.json'),J=L(P+'wall2024/joint_s119_VP1B_KWN_G4Mr2.json');
const raw=fs.readFileSync(P+'wall2024/ex34852_full.json','utf8');const T1="; the answer addresses Joseph's greeting but not the naming.";
const PL={J3a_stored:x=>x,
 J3b_challenger_side:x=>x.split("D4 vs C1 (Matthew 1:20): DEFENDER LINK BROKEN").join("D4 vs C1 (Matthew 1:20): CHALLENGER LINK BROKEN"),
 J3c_ground_left_unanswered:x=>x.split(T1).join("; the naming press was left unanswered."),
 J3d_both_terra_items_challenger:x=>x.split("DEFENDER LINK BROKEN").join("CHALLENGER LINK BROKEN")};
const get=async(W,RD)=>{const o=await run(W.code('Gate Build'),'Gate Build',RD);if(o.err)return {ERR:o.err};const m={};for(const it of (Array.isArray(o)?o:Object.values(o))){const j=it.json||it;for(const x of (j.items||[]))if(j.seat)m[j.seat+'|'+x.key]=x.why;}return m;};
(async()=>{for(const [k,f] of Object.entries(PL)){const t=f(raw);const RD=JSON.parse(t).data.resultData.runData;
 const s=await get(S,RD),v=await get(V,RD),g=await get(G,RD),j=await get(J,RD);if(s.ERR||v.ERR||g.ERR||j.ERR){console.log(k,'ERR',s.ERR,v.ERR,g.ERR,j.ERR);continue;}
 const keys=new Set([...Object.keys(v),...Object.keys(j)]);let bad=0,noted=0,vpChanged=0;
 for(const q of keys){const gNote=(s[q]!==undefined&&g[q]!==undefined&&g[q]!==s[q])?g[q].slice(s[q].length):'';if(gNote)noted++;
  if(v[q]!==s[q])vpChanged++;const exp=v[q]===undefined?undefined:(v[q]===s[q]&&g[q]!==undefined?g[q]:v[q]+gNote);if(exp!==j[q]){bad++;console.log('  MISMATCH',q);}}
 const dropped=Object.keys(s).filter(q=>!(q in j)&&(q in v));
 console.log(k,'applied',t!==raw||k==='J3a_stored','| items live',Object.keys(s).length,'VP1B',Object.keys(v).length,'joint',Object.keys(j).length,'| G4M notes',noted,'| VP1B-changed items',vpChanged,'| mismatches',bad,'| dropped beyond VP1B',dropped.length);}})();
