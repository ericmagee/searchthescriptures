// pkgCRG test: every library node that runs cureRecompute (Panel Cure Check, Cure Check, Alternate Merge Seat, ...) and the two __CSP nodes,
// strip_D38 vs strip_CRG over every saved run. Bars: outputs differ only in CONCEDED LINKS lines rewritten from a CORRECTED COUNT (and the
// AUDIT/superseded text quoting them) and in conceded_split; 33592 grok's line names premise 2 (D2 vs C4), premise 5 (D5 vs C5) and LINK 6,
// and its conceded_split reads unnamed 0.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s57.json';
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const S0='pkgLIB/strip_D38/patched/',S1='pkgLIB/strip_CRG/patched/';const plan=JSON.parse(fs.readFileSync('pkgCRG/plan_CRG.json','utf8'));
const files=Object.keys(plan.nodes).filter(f=>f.endsWith('.js'));
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const RCL=/(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS): \d+ -- recomputed after the cure[^\n"\\]*/g;
let nzb=[];let n=0,diff=0,stray=[],lines=[],err=[];const pc={};
for(const RUN of runs){for(const f of files){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b;try{a=JSON.stringify(harness(RUN)(fs.readFileSync(S0+f,'utf8'),i));}catch(e){err.push(RUN+' '+nm+' base: '+e.message.slice(0,60));continue;}
 try{b=JSON.stringify(harness(RUN)(fs.readFileSync(S1+f,'utf8'),i));}catch(e){err.push(RUN+' '+nm+' patched: '+e.message.slice(0,60));continue;}n++;
 if(nm==='Panel Cure Check'||nm==='Alternate Merge Seat'||nm==='Cure Check')pc[RUN+'|'+nm]=b;
 if(a===b)continue;diff++;const la=a.match(RCL)||[],lb=b.match(RCL)||[];
 // mask: every recomputed count line and the grounds clause it carries
 // resync diff: every place b departs from a must start with " -- grounds: " and rejoin a within 3000 chars
 const onlyGrounds=(a,b)=>{let p=0,q=0;while(p<a.length||q<b.length){if(a[p]===b[q]){p++;q++;continue;}if(!b.startsWith(' -- grounds: ',q))return false;const key=a.slice(p,p+60);const r=b.indexOf(key,q);if(r<0||r-q>3000)return false;q=r;}return true;};
 const nb=b.replace(/,\\*"broken_at_collision\\*":0,/g,',').replace(/,\\*"broken_items\\*":\[\]/g,'');if(/broken_at_collision\\*":[1-9]/.test(b))nzb.push(RUN+' '+nm);
 if(!onlyGrounds(a,nb))stray.push(RUN+' '+nm);
 for(const l of lb)if(/grounds:/.test(l))lines.push(RUN+' '+nm+': '+l.replace(/\\\\/g,'').slice(0,400));}}
T(n>=60,'replay ran on '+n+' node runs ('+err.length+' could not run, same in base: '+err.filter(e=>/base/.test(e)).length+')');
T(stray.length===0,'outputs differ only in the grounds clause of recomputed count lines ('+diff+' node runs differ; stray: '+(stray.join(', ')||'none')+')');
out.push('   node runs with a nonzero broken_at_collision split: '+(nzb.join(', ')||'none'));const uniq=[...new Set(lines.map(l=>l.replace(/^\S+ [^:]+: /,'')))];out.push('   recomputed lines with grounds: '+lines.length+' in node runs, '+uniq.length+' distinct:');uniq.forEach(l=>out.push('     '+l));
const g=lines.find(l=>/^33592 Panel Cure Check: CONCEDED LINKS: 3/.test(l))||'';
T(/premise 2 BROKEN AT THE COLLISION D2 vs C4 \(K-G7\)/.test(g)&&/premise 5 BROKEN AT THE COLLISION D5 vs C5 \(K-G7\)/.test(g)&&/before the cure, 1: LINK 6 UNEXHIBITED/.test(g)&&!/the grounds number/.test(g),'33592 grok: "CONCEDED LINKS: 3" names premise 2 (D2 vs C4), premise 5 (D5 vs C5) and LINK 6 UNEXHIBITED; grounds equal the count');
// __CSP: the split code itself (patched Alternate Merge copy == Build Save Body copy) on 33592 grok's recounted verdict text
{const src=fs.readFileSync(S1+'Alternate_Merge.js','utf8');const a=src.indexOf('const __CSP=(()=>{');const e=src.indexOf('const __CSPOUT=',a);const CSP=new Function(src.slice(a,e)+'\nreturn __CSP;')();
 const bs=fs.readFileSync('pkgCRG/patched/Build_Save_Body.js','utf8');const a2=bs.indexOf('const __CSP=(()=>{');const one_=x=>{const k=x.indexOf('const one=(t,side,stored)=>');return x.slice(k,x.indexOf('return (t,dc,cc)=>',k));};T(one_(bs)===one_(src)&&/broken_at_collision/.test(one_(bs)),'Build Save Body carries the same patched split function as Alternate Merge');
 const b=pc['33592|Panel Cure Check']||'';const raw=JSON.parse(b);let txt='';JSON.stringify(raw,(k,v)=>{if(typeof v==='string'&&/CONCEDED LINKS: 3 -- recomputed[^\n]*grounds:/.test(v.replace(/\\n/g,'\n'))&&!txt)txt=v.replace(/\\n/g,'\n');return v;});
 const r=CSP(txt,3,0);out.push('   33592 grok split: '+JSON.stringify(r&&r.defender));
 T(r&&r.defender&&r.defender.broken_at_collision===2&&r.defender.unexhibited===1&&r.defender.unnamed===0,'33592 grok conceded_split: unexhibited 1, broken_at_collision 2, unnamed 0 (base read unnamed 3)');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgCRG/test_CRG.txt',out.join('\n')+'\n');
