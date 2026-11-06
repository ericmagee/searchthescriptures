// pkgRCK (W3 Wall 2493): K-RECHK, TRIAL (record-only). Run from wall2024/: node pkgRCK/build_RCK.cjs
// Base: pkgKCL/patched. Every applied change (send-back sbApply, gate CHANGE TO, cure RESTATED / recompute) reaches the verdict text through
// cureRewrite(raw,panel,R,seat,F0), whose R.rp holds each [original line, new line(s)] pair. cureRewrite now re-checks the changed lines only:
//  - K-CMT: kcmtGrade2024 on each new line (a contested grade line that names no Commitment N);
//  - K-F: kfLines on each new FORCED line, with the run's rounds (the debate's rounds are the same for every seat: the seat's own Panel Build
//    body, else any judge body; with no rounds K-F is not re-checked and the mark says so once).
//  A hit whose original line had the same fault (K-CMT: the original line is also a contested grade with no commitment; K-F: the original
//  holds a FORCED line for the same pair that fails too) is marked "ALREADY IN THE ORIGINAL"; otherwise "NEW".
//  Each hit is one AUDIT mark after the SUPERSEDED marks: [AUDIT v39: K-RECHK -- SEAT; RULE; NEW or ALREADY IN THE ORIGINAL; LINE; ORIGINAL].
//  TRIAL: it is not a cure item, removes no seat and changes no count; the marks are stored with the verdict text.
// Raise-only nodes (Alternate Payloads, Extract Independent Verdict, Panel Payloads) have no cureRewrite and get only the helper.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const HELP="function rechk2024(rp,RD){const out=[];const one=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/\\s+/g,' ').trim();const has=RD&&['CR1','CR2','CR3','CR4','DR1','DR2','DR3','DR4'].some(k=>typeof RD[k]==='string');\n"
+" const pairOf=l=>{const m=one(l).match(/^(?:[-\\u2022]\\s*)?FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*(D\\d+)\\s+vs\\.?\\s+(C\\d+)/i);return m?(m[1]+' vs '+m[2]).toUpperCase():null;};\n"
+" for(const [o0,n0] of (rp||[])){const O=String(o0==null?'':o0).split('\\n').map(one).filter(Boolean),N=String(n0==null?'':n0).split('\\n').map(one).filter(Boolean);const OS=new Set(O);\n"
+"  for(const l of N){if(OS.has(l)||/^\\[AUDIT\\b/.test(l))continue;\n"
+"   if(kcmtGrade2024(l))out.push({rule:'K-CMT',line:l,orig:O.join(' / '),old:O.some(x=>kcmtGrade2024(x)),why:'a contested grade line that names no Commitment N'});\n"
+"   const pk=pairOf(l);if(pk){if(!has){out.push({rule:'K-F',line:l,orig:O.join(' / '),old:null,why:'not re-checked: no rounds'});continue;}const it=kfLines(l,RD).items;\n"
+"    if(it.length){const oi=O.filter(x=>pairOf(x)===pk);out.push({rule:'K-F',line:l,orig:O.join(' / '),old:oi.some(x=>kfLines(x,RD).items.length>0),why:it[0].why});}}}}\n"
+" return out;} /* pkgRCK (W3 2493): K-RECHK, the K-CMT and K-F re-check of the changed lines */\n"
+"function rechkRounds2024(seat){try{const PB=$('Panel Build').first().json;const J=PB.judges||[];const j=J.find(q=>q.seat===seat)||J.find(q=>q&&q.body);return j&&j.body?cureRounds(j.body):null;}catch(e){return null;}}\n";
const OLD_RET="return s+'\\n'+R.audit+sup;}";
const NEW_RET="let rk='';try{const H=rechk2024(R.rp,rechkRounds2024(seat));rk=H.map(h=>'\\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'RULE: '+h.rule+'; '+(h.old===null?'NOT CHECKED':(h.old?'ALREADY IN THE ORIGINAL':'NEW'))+': '+h.why+'; LINE: '+cureSafe(h.line).slice(0,300)+'; ORIGINAL: '+cureSafe(h.orig).slice(0,300)+'; TRIAL rule, record-only ; END]').join('');}catch(e){rk='\\n[AUDIT v39: K-RECHK -- the re-check failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}\n return s+'\\n'+R.audit+sup+rk;} /* pkgRCK: K-RECHK marks after the SUPERSEDED marks */";
const BASE=(process.argv[2]||'pkgKCL')+'/patched';const OUT=process.argv[3]||'pkgRCK'; /* [base] [out]: pkgRCLN stage (W3 2511) */const plan={base:BASE,nodes:[]};fs.rmSync(OUT+'/patched',{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 const i=t.indexOf('function kcmtLines2024(');if(i<0)throw new Error(f+' no kcmtLines2024');t=t.slice(0,i)+HELP+t.slice(i);ed.push('rechk2024 helper');
 const k=t.split(OLD_RET).length-1;const cr=/function cureRewrite\(/.test(t);if(k!==(cr?1:0))throw new Error(f+' cureRewrite return x'+k);if(k){t=t.split(OLD_RET).join(NEW_RET);ed.push('cureRewrite K-RECHK marks');}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),cure:cr,edits:ed});}
fs.writeFileSync(OUT+'/plan_RCK.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base_sha,'->',x.final_sha,x.edits.join('; ')));
