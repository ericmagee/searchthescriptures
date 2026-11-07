// pkgEOR tests and replay. (1) Anticheat Build base (live s44) vs patched on every saved run: items equal except where a close carries the marker.
// (2) E-OOR in Judge Enforcer Build (base --bbase vs pkgEOR) on the saved 33371 inputs with lines added to gemini's OUT-OF-ROUND CONCESSIONS section.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BB=process.env.BB||'pkgEFG/patched_live',PD=process.env.PD||'pkgEOR/patched_on_pkgEFG_patched_live';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const FBN=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s44.json','utf8'));const W=FBN.data||FBN;const conn=W.connections;
const feeder=n=>Object.entries(conn).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
const ACb=fs.readFileSync(PD+'_base/Anticheat_Build.js','utf8'),ACp=fs.readFileSync(PD+'/Anticheat_Build.js','utf8');
const RUNS='33218,33222,33249,33261,33276,33289,33299,33311,33322,33345,33371'.split(',');const items=o=>o.flatMap(c=>{const j=c.json||c;return (j.items||[]).map(x=>({side:x.side,verse:x.verse,close:x.close}));});
const prompt=o=>o.map(c=>{const j=c.json||c;return j.body?JSON.stringify(j.body):'';}).join('\n');
for(const R of RUNS){if(!has(R,'Anticheat Build'))continue;let b,p;try{b=harness(R)(ACb,feeder('Anticheat Build')[0]);p=harness(R)(ACp,feeder('Anticheat Build')[0]);}catch(e){console.log(R,'SKIP',String(e.message).slice(0,80));continue;}
 const pb=prompt(b),pp=prompt(p);let mk=false;try{const lib=fs.readFileSync('pkgEOR/eor_lib.js','utf8');mk=harness(R)(lib+"let F=null;try{F=$('Regrade Load').isExecuted?$('Regrade Load').first().json.f:$('Final Output').first().json;}catch(e){}return [{json:{m:!!F&&(!!eorTail(F.cr4)||!!eorTail(F.dr4))}}];",'x')[0].json.m;}catch(e){}
 if(!mk)t(R+' anticheat: no marker in any close, prompt byte-identical',pb===pp);
 else{const bi=items(b),pi=items(p);const gone=bi.filter(x=>!pi.some(y=>y.side===x.side&&y.verse===x.verse&&y.close===x.close));
  t(R+' anticheat: marker present; patched prompt holds no out-of-round words',!/outside the round/i.test(pp)&&!/The conception passages state otherwise/.test(pp)&&/The conception passages state otherwise/.test(pb),'');
  console.log('  '+R+' items base '+bi.length+' patched '+pi.length+'; changed or removed: '+gone.map(x=>x.side+' '+x.verse+' :: '+String(x.close).slice(0,120)).join(' || '));
  t(R+' anticheat: every changed item is a challenger item whose base close held the out-of-round words',gone.every(x=>x.side==='C'&&/outside the round|state otherwise|Christian traditions|rests on an inference/i.test(x.close)),JSON.stringify(gone).slice(0,300));}}
// E-OOR
const H=harness('33371');const pcc=JSON.parse(JSON.stringify(H("return [{json:$('Panel Cure Check').first().json}];",'x')[0].json));
const add=(lines)=>{const P=JSON.parse(JSON.stringify(pcc));P.bodies=P.bodies.map(b=>{const o=typeof b==='string'?JSON.parse(b):b;if(o.payload&&o.payload.judge_seat==='gemini'){o.payload.verdict_raw=String(o.payload.verdict_raw).replace('OUT-OF-ROUND CONCESSIONS\\n','OUT-OF-ROUND CONCESSIONS\\n'+lines.join('\\n')+'\\n');}return typeof b==='string'?JSON.stringify(o):o;});return P;};
const eor=(dir,P)=>{const out=harness('33371',{'Panel Cure Check':[{json:P}]})(fs.readFileSync(dir+'/Judge_Enforcer_Build.js','utf8'),feeder('Judge Enforcer Build')[0]);return ((out[0].json||{}).code_rows||[]).filter(r=>r.rule==='E-OOR').map(r=>r.flagged_line+' => '+r.cure_reason);};
{const P=add(['CHALLENGER | [DR4] | The conception passages state otherwise. | COUNTED']);const b=eor(BB,P),p=eor(PD,P);const nw=p.filter(x=>!b.includes(x));
 t('E1 a verbatim out-of-round note sentence listed as a [DR4] concession is refused (pkgEOR)',nw.length===1&&/pkgEOR/.test(nw[0]),JSON.stringify(nw));}
{const P=add(['CHALLENGER | [DR4] | My conclusion rests on an inference.']);const b=eor(BB,P),p=eor(PD,P);const nw=p.filter(x=>!b.includes(x));t('E2 a second note sentence (5 words) is refused',nw.length===1&&/pkgEOR/.test(nw[0]),JSON.stringify(nw));}
{const P=add(['DEFENDER | [CR4] | I grant they are signs, and Matthew 1:22-23 states which sign was fulfilled. | COUNTED']);const b=eor(BB,P),p=eor(PD,P);t('N1 a real close-round grant ([CR4], before any marker) is not refused by pkgEOR',JSON.stringify(b)===JSON.stringify(p),JSON.stringify(p.filter(x=>!b.includes(x))));}
{const b=eor(BB,pcc),p=eor(PD,pcc);t('N2 the saved 33371 sections: E-OOR rows unchanged',JSON.stringify(b)===JSON.stringify(p));}
console.log(ok+' OK, '+bad+' FAIL');
