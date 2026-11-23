// ASK 542 (W4): trace of the exemption call at index 479 under NEW, on the same inputs as replay542.cjs. Counts each call of unxAcFail made from the general raise
// (RK 'CR3'/'DR3' or 'CR[2-4]'/'DR[2-4]'), and why no item changes: for each premise that reaches 479, whether OLD or NEW exempts it.
const fs=require('fs');const {load}=require('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/sandbox.cjs');const B='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/rp542/',D='/mnt/project-files/ask542/w4/data/';
const N=load(B+'target_engine_542.json','Panel Payloads').ctx;const orig=N.unxAcFail;let cur=null;const log=[];
N.unxAcFail=function(TX,ref,RK){const v=orig(TX,ref,RK);if(cur)log.push({jid:cur,ref,RK,v});return v;};
const J=JSON.parse(fs.readFileSync(D+'judgments.json')),RI=Object.fromEntries(JSON.parse(fs.readFileSync(D+'results.json')).map(r=>[r.id,r]));
const map={CR1:'claude_r1',DR1:'engine_r1',CR2:'claude_r2',DR2:'engine_r2',CR3:'engine_r3',DR3:'challenger_r3',CR4:'defender_r4',DR4:'challenger_r4'};
for(const j of J){const r=RI[j.debate_id];const R={};for(const k in map)R[k]=r[map[k]]||'';cur=j.id;N.kunxLines(j.verdict_raw,R);}cur=null;
const by=k=>log.filter(x=>x.RK.includes('[')===k);const n3=by(false),n24=by(true);
console.log('unxAcFail calls: round-3 tag',n3.length,'(true',n3.filter(x=>x.v).length,') | round 2-4 tag',n24.length,'(true',n24.filter(x=>x.v).length,')');
console.log('judgments where the general raise reached the exemption:',new Set(log.map(x=>x.jid)).size);
const gained=n24.filter(x=>x.v);console.log('calls where NEW alone is true (the round 2-4 call ran because the round-3 call was false, and it is true):',gained.length,JSON.stringify(gained.slice(0,10)));
