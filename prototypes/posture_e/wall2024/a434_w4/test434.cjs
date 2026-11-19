// ASK 434 C2/C4/WRONG-IF unit tests: old (live db713b6a) vs built (t434) library functions on the 15 stored rows.
const fs=require('fs'),vm=require('vm');const T=require('../tools/lib.cjs');
// extract the named library functions and every library function they call (brace-balanced from the definition line)
const load=f=>{let w=JSON.parse(fs.readFileSync(f));w=w.data&&w.data.nodes?w.data:w;const U=T.unpack(w);const L=U.L;
 const grab=name=>{const i=L.findIndex(l=>new RegExp('^\\s*function '+name+'\\(').test(l));if(i<0)return null;let d=0,out=[];for(let j=i;j<L.length;j++){out.push(L[j]);for(const c of L[j].replace(/\/(?:\\.|[^\/\n])+\/[gimsuy]*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g,''))if(c==='{')d++;else if(c==='}')d--;if(d<=0&&j>=i&&out.join('').includes('{'))break;}return out.join('\n');};
 const have=new Map();const q=['cureSupHead','kcmtGrade2024','rcObjEnd'];while(q.length){const n=q.shift();if(have.has(n))continue;const src=grab(n);if(!src){have.set(n,null);continue;}have.set(n,src);for(const m of src.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g))if(!have.has(m[1]))q.push(m[1]);}
 const code=[...have.values()].filter(Boolean).join('\n');const ctx={console};vm.createContext(ctx);vm.runInContext(code+'\n;this.cureSupHead=cureSupHead;this.kcmtGrade2024=kcmtGrade2024;',ctx);ctx.__fns=[...have].filter(x=>x[1]).map(x=>x[0]);return ctx;};
const OLD=load(process.argv[2]),NEW=load(process.argv[3]);const R=JSON.parse(fs.readFileSync(process.argv[4]));
console.log('functions loaded:',NEW.__fns.join(' '));let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const HRE=/SUPERSEDED BY (CURE|SEND-BACK|RECOMPUTE): verdict ([A-Z-]+) to ([A-Z-]+); see the (cure|send-back|recompute) lines below/g;
const strip=s=>s.replace(/SUPERSEDED BY (?:CURE|SEND-BACK|RECOMPUTE): verdict [A-Z-]+ to [A-Z-]+; see the (?:cure|send-back|recompute) lines below(?:\\n|\n)/g,'');
console.log('C2: rule for the step: any [AUDIT v37 -> SEND-BACK; else any [AUDIT v21 -> CURE; else RECOMPUTE');
for(const r of R){const s=r.verdict_raw;const m=[...s.matchAll(HRE)];if(m.length!==1){ok(false,r.id+' input heads '+m.length);continue;}
 const o=m[0][2],n=m[0][3];const st=/\[AUDIT v37/.test(s)?'SEND-BACK':/\[AUDIT v21/.test(s)?'CURE':'RECOMPUTE';
 const out=NEW.cureSupHead(s,o,n,st);const hs=[...out.matchAll(HRE)];
 const one=hs.length===1&&hs[0][1]===st&&hs[0][2]===o&&hs[0][3]===n&&hs[0][4]===st.toLowerCase();
 const same=strip(out)===strip(s);const idem=NEW.cureSupHead(out,o,n,st)===out;
 const oldSame=OLD.cureSupHead(s,o,n)===NEW.cureSupHead(s,o,n,'CURE');
 ok(one&&same&&idem&&oldSame,`${r.id} ${r.judge_seat} ${st} "${hs[0]&&hs[0][0]}" one-head=${one} only-label-differs=${same} idempotent=${idem} CURE-form-equals-old=${oldSame}`);
 if(r.id===1221)ok(hs[0]&&hs[0][0]==='SUPERSEDED BY SEND-BACK: verdict HELD to BROKEN; see the send-back lines below','1221 (run 38593 sonnet) reads the expected send-back line');}
// C4
const F=['SUPERSEDED BY CURE: verdict HELD to BROKEN; see the cure lines below','SUPERSEDED BY SEND-BACK: verdict HELD to BROKEN; see the send-back lines below','SUPERSEDED BY RECOMPUTE: verdict HELD to BROKEN; see the recompute lines below'];
F.forEach(f=>ok(NEW.kcmtGrade2024(f)===false,'C4 built kcmtGrade2024 false on "'+f.slice(0,32)+'"'));
ok(OLD.kcmtGrade2024(F[1])===true,'WRONG-IF plant: OLD kcmtGrade2024 grades the SEND-BACK line as a judge line (true): check can fail');
ok(OLD.kcmtGrade2024(F[2])===true,'WRONG-IF plant: OLD kcmtGrade2024 grades the RECOMPUTE line (true)');
let lines=0,diff=0;for(const r of R){for(const l of r.verdict_raw.split(/\n|\\n/)){lines++;if(OLD.kcmtGrade2024(l)!==NEW.kcmtGrade2024(l))diff++;}}
ok(diff===0,`C4 kcmtGrade2024 old vs built equal on ${lines} lines of the 15 rows (diffs ${diff})`);
// WRONG-IF chain plant: cure HELD->BROKEN then send-back BROKEN->HELD
const base=strip(R[0].verdict_raw);const s1=NEW.cureSupHead(base,'HELD','BROKEN','CURE');const s2=NEW.cureSupHead(s1,'BROKEN','HELD','SEND-BACK');const h2=[...s2.matchAll(HRE)];
ok(h2.length===1&&h2[0][0]==='SUPERSEDED BY SEND-BACK: verdict BROKEN to HELD; see the send-back lines below','WRONG-IF chain plant: one line, "'+(h2[0]&&h2[0][0])+'"');
// back to same verdict: no head
const s3=NEW.cureSupHead(s2,'HELD','HELD','RECOMPUTE');ok([...s3.matchAll(HRE)].length===0,'no-change call removes the head (as old code)');
const s4=NEW.cureSupHead(strip(R[0].verdict_raw),'HELD','BROKEN','RECOMPUTE');const h4=[...s4.matchAll(HRE)];ok(h4.length===1&&h4[0][0]==='SUPERSEDED BY RECOMPUTE: verdict HELD to BROKEN; see the recompute lines below','RECOMPUTE plant (no stored row has a no-cure recompute): "'+(h4[0]&&h4[0][0])+'"');
const s5=NEW.cureSupHead(strip(R[0].verdict_raw),'HELD','BROKEN','bogus');ok([...s5.matchAll(HRE)][0][1]==='CURE','unknown step falls back to CURE');
console.log(fail?'RESULT: FAIL '+fail:'RESULT: PASS');
