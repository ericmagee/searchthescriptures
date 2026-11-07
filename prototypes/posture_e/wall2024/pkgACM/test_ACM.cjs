// pkgACM test. Run from wall2024/: node pkgACM/test_ACM.cjs
// 1. Line parity on the corpus (corpus/texts.jsonl, every judge text): every ANSWER CHECK line read the old way and the pkgACM way, for
//    (a) claims(): verse, round, MEANS, "MEANS NONE" claim, grade; (b) enf428Cure's AC read (verse, rounds, ANSWER, grade). Every difference listed.
// 2. Units: inner quote, em dash separators, bare MEANS NONE, multi-round, refused line falls back.
// 3. Node replay: every saved run 33218+ x the 4 Send Back nodes, base s50 vs patched; every changed output listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s50.json';
const B0=f=>fs.readFileSync(__dirname+'/base_s50/'+f,'utf8'),P1=f=>fs.readFileSync(__dirname+'/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
// the patched node's own helpers and reader, taken from the node text
const src=P1('Send_Back_Record.js');const a=src.indexOf('const __RL=(function(){'),e=src.indexOf('\nfunction __sbxRL(');
const {__acm,__acm4}=new Function(src.slice(a,e+1)+'\nreturn {__acm,__acm4};')();
const N=s=>String(s);
const oldClaim=l=>{const m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--\s*\[\s*([CD])R\s*(\d)\s*\]/);if(!m)return null;const mm=l.match(/--\s*MEANS\s*:\s*(["“]?)([^"”]*?)\1\s*(?:--|$)/);const mv=mm?mm[2].trim():null;
 return {verse:m[1].trim(),round:m[2]+'R'+m[3],means:mv,none:mv!==null&&/^(?:NONE|N\/A|-+)?\.?$/i.test(mv),grade:(l.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1]||null};};
const newClaim=l=>{const A=__acm(l);if(!A||A.rounds.length!==1)return oldClaim(l);const mv=A.means===undefined?null:String(A.means).trim();
 return {verse:A.verse,round:A.rounds[0][0]+'R'+A.rounds[0].slice(2),means:mv,none:mv!==null&&/^(?:NONE|N\/A|-+)?\.?$/i.test(mv),grade:A.grade};};
const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
const pick=x=>x?{verse:x[1],rounds:x[2].replace(/\s*[;,]\s*/g,'; ').toUpperCase(),answer:x[4],grade:x[5].toUpperCase()}:null;
const old4=l=>pick(String(l).replace(/\\+"/g,'"').match(AC)),new4=l=>{const s=String(l).replace(/\\+"/g,'"');return pick(__acm4(s)||s.match(AC));};
// 1. corpus
{const rows=fs.readFileSync('corpus/texts.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse);let nl=0;const dc={},d4={};const ex={c:[],f:[]};
 for(const r of rows){for(const l0 of String(r.jtext||'').split('\n')){const l=l0.trim();if(!/ANSWER CHECK\s*:/.test(l))continue;nl++;
  if(/^ANSWER CHECK\s*:/.test(l)){const o=oldClaim(l),n=newClaim(l);const so=JSON.stringify(o),sn=JSON.stringify(n);if(so!==sn){
   const k=!o?'old none, new reads':!n?'old reads, new skips':o.none!==n.none?'MEANS NONE claim '+o.none+' -> '+n.none:o.grade!==n.grade?'grade':o.verse!==n.verse?'verse':o.round!==n.round?'round':'MEANS text only';
   dc[k]=(dc[k]||0)+1;if(ex.c.length<40&&k!=='MEANS text only'||(dc[k]<=3))ex.c.push(k+' | '+r.run+' '+r.seat+' '+r.src+'\n     '+l.slice(0,260)+'\n     old '+so.slice(0,200)+'\n     new '+sn.slice(0,200));}}
  const o=old4(l),n=new4(l);const so=JSON.stringify(o),sn=JSON.stringify(n);if(so!==sn){const k=!o?'old refuses, new reads':!n?'old reads, new refuses':o.answer!==n.answer?'ANSWER text':o.rounds!==n.rounds?'rounds':o.verse!==n.verse?'verse':'grade';
   d4[k]=(d4[k]||0)+1;if(d4[k]<=4)ex.f.push(k+' | '+r.run+' '+r.seat+' '+r.src+'\n     '+l.slice(0,260)+'\n     old '+so.slice(0,220)+'\n     new '+sn.slice(0,220));}}}
 log('1. corpus: '+rows.length+' texts, '+nl+' lines naming ANSWER CHECK');log('   claims() differences: '+JSON.stringify(dc));for(const x of ex.c)log('   '+x);
 log('   enf428 AC differences: '+JSON.stringify(d4));for(const x of ex.f)log('   '+x);}
// 2. units
{const u=(l,f,want,m)=>{const g=JSON.stringify(f(l));T(g===JSON.stringify(want),m+' -> '+g.slice(0,200));};
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: "the “power” of the Highest" -- ANSWER: "x y z" -- MEETS',newClaim,{verse:'Luke 1:35',round:'CR3',means:'the “power” of the Highest',none:false,grade:'MEETS'},'claims: inner curly quote MEANS read whole');
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: "the "power" of the Highest" -- ANSWER: "x y z" -- MEETS',newClaim,{verse:'Luke 1:35',round:'CR3',means:'the "power" of the Highest',none:false,grade:'MEETS'},'claims: inner straight quote MEANS read whole (old read: null)');
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: NONE -- ANSWER: "x" -- UNPROVEN',newClaim,{verse:'Luke 1:35',round:'CR3',means:'NONE',none:true,grade:'UNPROVEN'},'claims: bare MEANS NONE still a claim');
 u('ANSWER CHECK: Luke 1:35 — [CR3] — MEANS: NONE — ANSWER: "x" — UNPROVEN',newClaim,{verse:'Luke 1:35',round:'CR3',means:'NONE',none:true,grade:'UNPROVEN'},'claims: em dash separators read (old: skipped)');
 u('ANSWER CHECK: Luke 1:35 -- [CR2], [CR3] -- MEANS: NONE -- ANSWER: "x" -- UNPROVEN',newClaim,oldClaim('ANSWER CHECK: Luke 1:35 -- [CR2], [CR3] -- MEANS: NONE -- ANSWER: "x" -- UNPROVEN'),'claims: two rounds keep the old read (first bracket)');
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: NONE -- ANSWER: "x" -- meets',newClaim,oldClaim('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: NONE -- ANSWER: "x" -- meets'),'claims: a line the reader refuses (lower-case grade) keeps the old read');
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: "a "b" c" -- ANSWER: "he said "go" now" -- MEETS',new4,{verse:'Luke 1:35',rounds:'CR3',answer:'he said "go" now',grade:'MEETS'},'enf428: inner quotes in MEANS and ANSWER');
 u('ANSWER CHECK: Luke 1:35 — [CR3] — MEANS: NONE — ANSWER: "he said go now" — MISSES',new4,{verse:'Luke 1:35',rounds:'CR3',answer:'he said go now',grade:'MISSES'},'enf428: em dashes and bare MEANS read (old: "not an ANSWER CHECK line")');
 u('ANSWER CHECK: Luke 1:35 -- [CR3] -- MEANS: "a" -- ANSWER: "b" -- UNPROVEN',new4,null,'enf428: UNPROVEN still not read, as before');}
// 3. node replay
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0;const flips=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){log('   '+RUN+' no harness: '+String(x.message).slice(0,80));continue;}for(const nm of ['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record']){if(!fs.existsSync(D+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;const f=nm.replace(/ /g,'_')+'.js';
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;const sa=st(a),sb=st(b);if(sa===sb)continue;let j=0;while(sa[j]===sb[j])j++;flips.push(RUN+' '+nm+' @'+j+'\n   base:    '+sa.slice(Math.max(0,j-200),j+150)+'\n   patched: '+sb.slice(Math.max(0,j-200),j+200));}}
log('3. node runs compared: '+n+' ('+runs.length+' runs); changed outputs: '+flips.length);for(const f of flips)log(f);T(n>0,'replay ran');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_ACM.txt',out.join('\n')+'\n');
