// pkgWLG test. Run from wall2024/: node pkgWLG/test_WLG.cjs [base strip=pkgLIB/strip_KWI] [dest strip=pkgLIB/strip_WLG]
// 1 Conformance: kgaInAns2024 gives the same answer as pkgWLD's wldInAns2024 (from pkgWLD/patched Panel Build) at every verse-like position of
//   every long text saved for 6 runs.
// 2 Replay: every library node with kg4Split (base vs dest) on every saved run. After the 3 text renders are put back, an output that still
//   differs is a gate change; each changed value is listed (path, base, dest).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const FB='/mnt/project-files/wall2024/fetchback_live_s70.json';
const A=(process.argv[2]||'pkgLIB/strip_KWI').replace(/\/$/,'')+'/patched/',B=(process.argv[3]||'pkgLIB/strip_WLG').replace(/\/$/,'')+'/patched/';
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
// 1
const PB=fs.readFileSync('pkgWLD/rev2/patched/Panel_Build.js','utf8');
const grab=(s,name)=>{const i=s.indexOf('const '+name+'=');if(i<0)throw new Error('no '+name);let j=s.indexOf('return false;};',i);return s.slice(i,j+'return false;};'.length);};
const wld=new Function(grab(PB,'wldInAns2024')+'\nreturn wldInAns2024;')();const kga=new Function(grab(fs.readFileSync(B+'Gate_Record.js','utf8'),'kgaInAns2024')+'\nreturn kgaInAns2024;')();
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d{5}_/.test(f)).map(f=>f.split('_')[0]))].sort();
{let n=0,yes=0,dis=[];const texts=new Set();const walk=x=>{if(typeof x==='string'){if(x.length>1500)texts.add(x);}else if(x&&typeof x==='object')for(const v of Object.values(x))walk(v);};
 for(const R of runs.slice(-6))for(const f of fs.readdirSync(D).filter(f=>f.startsWith(R+'_')))try{walk(JSON.parse(fs.readFileSync(D+f,'utf8')));}catch(e){}
 for(const t of texts)for(const m of t.matchAll(/(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+/g)){n++;const a=wld(t,m.index),b=kga(t,m.index);if(a)yes++;if(a!==b)dis.push(m[0]);}
 T(n>1000&&!dis.length,'kgaInAns2024 = wldInAns2024 at '+n+' verse positions in '+texts.size+' saved texts ('+yes+' in an answer)'+(dis.length?'; differ at '+dis.slice(0,5).join(', '):''));}
// 2
const PAIRS=[["' named in no answer in a later '","' named in no later '"],["rests on in an answer: '","rests on: '"]];
const enc=s=>JSON.stringify(s).slice(1,-1);const back=s=>{for(const [n,o] of PAIRS)for(const [x,y] of [[enc(enc(n)),enc(enc(o))],[enc(n),enc(o)],[n,o]])s=s.split(x).join(y);return s;};
const norm=s=>s.replace(/"(at|ms|elapsed_ms|started_at|now)":\s*("[^"]*"|\d+)/g,'"$1":0');
const run=async(src,Rn,IN)=>{try{return {o:await Promise.resolve(harness(Rn)('return (async()=>{'+src+'\n})()',IN))};}catch(e){return {e:String(e&&e.message||e).slice(0,120)};}};
const dd=(a,b,p,acc)=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))dd(a[k],b[k],p+'.'+k,acc);return;}acc.push({p,a,b});};
const files=fs.readdirSync(B).filter(f=>fs.readFileSync(B+f,'utf8').includes('kgaInAns2024'));
(async()=>{let R=0,E=0,X=0;const changes=[];
 for(const f of files){const n=f.replace(/\.js$/,'').replace(/_/g,' ');const IN=feeder(FB,n)[0];if(!IN){log('SKIP '+n+': no feeder');continue;}
  const a0=fs.readFileSync(A+f,'utf8'),b0=fs.readFileSync(B+f,'utf8');let ran=0,eq=0,txt=0,ch=[];
  for(const Rn of runs){const a=await run(a0,Rn,IN),b=await run(b0,Rn,IN);if(a.e&&b.e&&a.e===b.e)continue;ran++;
   const sa=a.e?'ERR '+a.e:norm(JSON.stringify(a.o)),sb=b.e?'ERR '+b.e:norm(JSON.stringify(b.o));if(sa===sb){eq++;continue;}
   const bb=back(sb);if(bb===sa){txt++;continue;}ch.push(Rn);
   if(a.e||b.e){changes.push({node:n,run:Rn,p:'(error)',a:a.e||'ok',b:b.e||'ok'});continue;}
   const acc=[];dd(JSON.parse(sa),JSON.parse(bb),'',acc);for(const z of acc)changes.push({node:n,run:Rn,...z});}
  R+=ran;E+=eq;X+=txt;log('     '+n+': '+ran+' runs, '+eq+' byte-equal, '+txt+' differ only in the reason text'+(ch.length?', GATE CHANGE in '+ch.join(' '):''));}
 log('replay: '+R+' node runs, '+E+' byte-equal, '+X+' differ only in the reason text, '+(R-E-X)+' with a gate change');
 fs.writeFileSync('pkgWLG/replay_changes.json',JSON.stringify(changes,null,1));log('changed values: '+changes.length+' (pkgWLG/replay_changes.json)');
 log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgWLG/test_WLG.txt',out.join('\n')+'\n');})();
