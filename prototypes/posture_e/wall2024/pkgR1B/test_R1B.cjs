// pkgR1B test (reader item 1b). Run from wall2024/: node --max-old-space-size=8000 pkgR1B/test_R1B.cjs
// Base = pkgLIB/strip_KCR2 (live v14_KCR2 library); patched = pkgLIB/strip_R1B.
// (a) Corpus: every ANSWER CHECK line in corpus/texts.jsonl (jtext), old regex extraction vs shared-reader extraction,
//     for gateAnsGround2024 (ref, round, MISSES, MEANS NONE -> fires?) and dptCheck (ref, round, MEANS). Every differing line listed.
// (b) Replay: every saved run x the 6 changed nodes, base vs patched; every changed output listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const B0=f=>fs.readFileSync('pkgLIB/strip_KCR2/patched/'+f,'utf8'),P1=f=>fs.readFileSync('pkgLIB/strip_R1B/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const CH=['Gate_Build.js','Gate_Record.js','Alt_Gate_Build.js','Alt_Gate_Record.js','Alternate_Merge.js','Alternate_Merge_Seat.js'];
// static: every changed file has the 3 edits, every other file byte-identical
const all=fs.readdirSync('pkgLIB/strip_KCR2/patched').filter(f=>f.endsWith('.js')).sort();
for(const f of all){const a=B0(f),b=P1(f);if(CH.includes(f))T(a!==b&&(b.match(/pkgR1B/g)||[]).length===3,f+' carries the 3 pkgR1B edits');else T(a===b,f+' unchanged');}
// packed library: every pkgLIB_v15_R1B stub rebuilds its full source byte for byte from the Shared Library (as in n8n)
{const {rebuild}=require('../pkgLIB/unpack.cjs');const lib=fs.readFileSync('pkgLIB_v15_R1B/patched/Shared_Library.js','utf8');let k=0;
 for(const f of all){if(rebuild(fs.readFileSync('pkgLIB_v15_R1B/patched/'+f,'utf8'),lib)===P1(f))k++;else log('  stub mismatch '+f);}T(k===22,'pkgLIB_v15_R1B: '+k+' of 22 stubs rebuild the strip_R1B source byte for byte');}
// (a) corpus
const src=P1('Gate_Build.js');const s0=src.indexOf('const __RL=(function(){'),e0=src.indexOf('return module.exports;})();',s0)+'return module.exports;})();'.length;
const __RL=new Function(src.slice(s0,e0)+'\nreturn __RL;')();
const __acRead=l=>{try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}};
const gOld=raw=>{const l=raw.replace(/[*_`]+/g,'').trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!m)return {read:false,fires:false};
 const gs=[...l.matchAll(/(?:--|—)\s*(MEETS|MISSES)\b/gi)];const mis=!!gs.length&&gs[gs.length-1][1].toUpperCase()==='MISSES';const none=/(?:--|—)\s*MEANS\s*:\s*NONE\b/i.test(l);
 const ref=m[1].replace(/\s+/g,' ').trim();return {read:true,ref,round:m[2].toUpperCase(),mis,none,fires:mis&&!none&&/^(?:[1-3]\s)?[A-Za-z][A-Za-z ]*\s\d+:\d+$/.test(ref)};};
const gNew=raw=>{const l=raw.replace(/[*_`]+/g,'').trim();const a=__acRead(raw);const one=!!(a&&Array.isArray(a.rounds)&&a.rounds.length===1&&a.verse);if(!one)return gOld(raw);
 const ref=String(a.verse).replace(/\s+/g,' ').trim();const mis=String(a.grade||'').toUpperCase()==='MISSES';const none=/^NONE\b/i.test(String(a.means||'').trim());
 return {read:true,ref,round:String(a.rounds[0]).toUpperCase(),mis,none,fires:mis&&!none&&/^(?:[1-3]\s)?[A-Za-z][A-Za-z ]*\s\d+:\d+$/.test(ref)};};
const dOld=raw=>{const L0=String(raw).replace(/[*_`]+/g,'');const am=L0.match(/ANSWER CHECK\s*:\s*((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+):(\d+)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!am)return {read:false};
 const mm=L0.match(/MEANS\s*:\s*([\s\S]*?)(?:\s(?:--|—)\s*ANSWER\s*:|$)/i);return {read:true,ref:am[1]+' '+am[2]+':'+am[3],round:am[4].toUpperCase(),means:mm?mm[1]:''};};
const dNew=raw=>{const L0=String(raw).replace(/[*_`]+/g,'');const a=__acRead(raw);const v=(a&&Array.isArray(a.rounds)&&a.rounds.length===1)?String(a.verse||'').match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+):(\d+)$/):null;
 if(!v)return dOld(raw);const mm=L0.match(/MEANS\s*:\s*([\s\S]*?)(?:\s(?:--|—)\s*ANSWER\s*:|$)/i);
 return {read:true,ref:v[1]+' '+v[2]+':'+v[3],round:String(a.rounds[0]).toUpperCase(),means:typeof a.means==='string'?a.means:(mm?mm[1]:'')};};
const C=fs.readFileSync('corpus/texts.jsonl','utf8').trim().split('\n').map(JSON.parse);const seen=new Set();let n=0,shared=0;const gd=[],dd=[],cls={};
// MEANS is only used through f()=krulNorm(kkjvNoMargin()) in dptCheck (has(MEANS,P) and cw(MEANS)), so compare after that same normalising.
const g0=src.indexOf('function krulNorm('),g1=src.indexOf('function kkjvNoMargin(');const cut=i=>src.slice(i,src.indexOf('\n',i));
const {krulNorm,kkjvNoMargin}=new Function(cut(g0)+'\n'+cut(g1)+'\nreturn {krulNorm,kkjvNoMargin};')();const norm=s=>krulNorm(kkjvNoMargin(s));
for(const r of C)for(const raw of String(r.jtext||'').split('\n')){if(!/ANSWER CHECK\s*:/i.test(raw))continue;const k=raw.trim();if(seen.has(k))continue;seen.add(k);n++;
 const a=__acRead(raw);if(a&&a.rounds&&a.rounds.length===1)shared++;
 const go=gOld(raw),gn=gNew(raw);const gk=['read','ref','round','mis','none','fires'].filter(x=>go[x]!==gn[x]);
 if(gk.length){const c='gate '+gk.join('+')+(go.fires!==gn.fires?' FIRES '+go.fires+'->'+gn.fires:'');cls[c]=(cls[c]||0)+1;gd.push(r.run+' '+r.seat+' '+r.tid+' ['+c+'] old='+JSON.stringify(go)+' new='+JSON.stringify(gn)+'\n      '+k.slice(0,260));}
 const xo=dOld(raw),xn=dNew(raw);const dk=['read','ref','round'].filter(x=>xo[x]!==xn[x]);if(xo.read&&xn.read&&norm(xo.means)!==norm(xn.means))dk.push('means');
 if(dk.length){const c='dpt '+dk.join('+');cls[c]=(cls[c]||0)+1;dd.push(r.run+' '+r.seat+' '+r.tid+' ['+c+'] old='+JSON.stringify(xo).slice(0,300)+' new='+JSON.stringify(xn).slice(0,300)+'\n      '+k.slice(0,260));}}
log('(a) corpus: '+n+' distinct ANSWER CHECK lines; shared reader reads one round on '+shared);log('    classes: '+JSON.stringify(cls));
log('  gateAnsGround2024 differences: '+gd.length);for(const x of gd)log('   '+x);
log('  dptCheck differences (MEANS compared after the krulNorm(kkjvNoMargin())): '+dd.length);for(const x of dd)log('   '+x);
T(n>0&&shared>0,'corpus read');
if(process.env.SKIPB){log("TOTAL "+ok+" OK, "+bad+" FAIL");fs.writeFileSync("pkgR1B/test_R1B_a.txt",out.join("\n")+"\n");process.exit(0);}
// (b) replay
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);let m=0;const ch=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of CH){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}m++;const A=st(a),B=st(b);if(A===B)continue;
 let p=0;while(p<A.length&&A[p]===B[p])p++;ch.push(RUN+' '+nm+': first difference at char '+p+'\n      base:    '+A.slice(Math.max(0,p-120),p+200)+'\n      patched: '+B.slice(Math.max(0,p-120),p+200));}}
log('(b) replay: '+m+' node runs over '+runs.length+' runs; changed outputs: '+ch.length);for(const x of ch)log('   '+x);T(m>0,'replay ran');
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgR1B/test_R1B.txt',out.join('\n')+'\n');
