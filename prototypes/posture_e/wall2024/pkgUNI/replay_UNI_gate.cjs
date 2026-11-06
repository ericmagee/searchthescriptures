// pkgUNI: 33160 gemini through the whole gate (gateItems2024, then gateCure2024 on gemini's stored gate reply), base and package.
// Run from wall2024/: node pkgUNI/replay_UNI_gate.cjs [run=33160] [seat=gemini]
const fs=require('fs'),zlib=require('zlib');const [run,seat]=[process.argv[2]||'33160',process.argv[3]||'gemini'];
const mk=p=>{const S=fs.readFileSync(p+'/patched/Gate_Record.js','utf8');return new Function('$','$input',S.slice(0,S.indexOf("const PASS=$('Send Back Record').first().json;"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);};
const G=JSON.parse(fs.readFileSync('corpus/raw/gate_'+run+'.json'));const g=G['Gate Record'][0]['0'];const pb=G['Panel Build'][0]['0'];
const N=JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));const p=N.nodes['Panel Cure Check'].slice(-1)[0][0].bodies.map(s=>JSON.parse(s).payload).find(p=>p.judge_seat===seat);
const its=g.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');const reply=(g.gate_rows||[]).filter(r=>r.seat===seat&&r.response_line).map(r=>r.response_line).join('\n');
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};const j=pb.judges.find(q=>q.seat===seat);
for(const P of ['pkgKGW','pkgUNI']){const L=mk(P);const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const R=L.gateItems2024(seat,p.verdict_raw,F,its,ctx);const C=R.items.length?L.gateCure2024(seat,p.verdict_raw,F,its,R.items,reply,ctx):{res:[],uncured:0,fresh:[]};
 console.log(P+': gate items '+R.items.length+', uncured counted '+C.uncured+', new items '+(C.fresh||[]).length+' -> '+(C.uncured>0?'REMOVED':'kept'));for(const r of C.res)console.log('   '+r.gid+' '+r.kind+' '+(r.cured?'CURED':'UNCURED')+(r.live?'':' (record only)')+' -- '+String(r.why||'').slice(0,120));
 for(const f of (C.fresh||[]))console.log('   NEW '+f.kind+' ('+f.src+'): '+String(f.why).slice(0,120));}
