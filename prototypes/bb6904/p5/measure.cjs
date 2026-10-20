// BB-6904 (d) measurement: what each re-grade option does to the seats and the panel outcome, on 27259 and replays 233-238, if every
// K-B-flagged DEFENDER LINK BROKEN ground stays UNCURED (the upper bound; all cured = no change). Read-only; rows from rows.json.
const fs=require('fs');const blk=fs.readFileSync(process.argv[2],'utf8');eval(blk.replace(/^const /gm,'var '));
const rows=JSON.parse(fs.readFileSync(process.argv[3]||__dirname+'/rows.json','utf8'));
const text=r=>{let t=r.raw;try{const j=JSON.parse(t);t=j.reasoning!=null?j.reasoning:(j.reason||t);}catch(e){const k=t.indexOf('\n\n[AUDIT v');if(k>=0)t=t.slice(0,k);try{const j=JSON.parse(t);t=j.reasoning!=null?j.reasoning:(j.reason||t);}catch(e2){}}return String(t);};
const D='[\\s\\u2010-\\u2015\\u2212-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';
const rule=(n,w,k,ks,ds)=>(k>=1)?'BROKEN-1':((2*w>n||ks==='WITHDRAWN')?'BROKEN-2':((w>=1)?'PARTIAL-1':((ds==='COLLAPSED')?'PARTIAL-2':'HELD-1')));
const out=[];
for(const r of rows){const t=text(r);const U=t.toUpperCase().replace(/[*_`]+/g,'');
 const nwk=(U.match(/(^|\n)[ \t]*CLAUSE[^\n]*/)||[''])[0].match(/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/)||U.match(/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/);
 const n=nwk?+nwk[1]:null,w=nwk?+nwk[2]:null,k=nwk?+nwk[3]:null;
 const clause=(U.match(new RegExp('(^|\\n)[ \\t]*CLAUSE'+SEP+'(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)'))||[])[2]||null;
 const KS=U.match(new RegExp('(^|\\n)[ \\t]*KEYSTONE'+SEP+'D([0-9]+)'+SEP+'(WITHDRAWN|BROKEN|STANDS)(?![A-Z0-9])'));const ksl=KS?+KS[2]:null,kss=KS?KS[3]:null;
 const col={};const lines=t.split('\n');
 for(const line of lines){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m)continue;const rest=m[2];let st=null;
  if(/^VS\.?\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}else{const g=rest.match(/^(WITHDRAWN|STANDS)\b/);st=g?g[1]:null;}
  if(!st)continue;const kinds=st==='DEFENDER LINK BROKEN'?drvKinds(line):null;(col[+m[1]]=col[+m[1]]||[]).push({st,kinds:kinds?kinds.length:null});}
 const state=(i,drop)=>{const a=col[i]||[];const W=a.some(x=>x.st==='WITHDRAWN');const B=a.some(x=>x.st==='DEFENDER LINK BROKEN'&&(!drop||x.kinds>=2));return (W&&B)?'CONFLICT':W?'WITHDRAWN':B?'BROKEN':'STANDS';};
 const ids=Object.keys(col).map(Number).sort((a,b)=>a-b);
 const kB=ids.filter(i=>state(i,false)==='BROKEN'),kA=ids.filter(i=>state(i,true)==='BROKEN');
 const lines_def=ids.reduce((s,i)=>s+(col[i]||[]).filter(x=>x.st==='DEFENDER LINK BROKEN').length,0);
 const flagged=ids.reduce((s,i)=>s+(col[i]||[]).filter(x=>x.st==='DEFENDER LINK BROKEN'&&x.kinds<2).length,0);
 const ks2=(kss==='BROKEN'&&ksl!==null&&state(ksl,true)!=='BROKEN')?(state(ksl,true)==='WITHDRAWN'?'WITHDRAWN':'STANDS'):kss;
 // Option 1: mechanical recount, the judge's own n and w, k from the surviving lines, the extractor's rule (v9 N3).
 const k1=kA.length;const c1=(n!==null&&w!==null)?rule(n,w,k1,ks2,r.ds):null;
 out.push({src:r.src,seat:r.seat,tag:r.tag,ds:r.ds,clause,n,w,k_judge:k,k_lines:kB.length,def_broken_lines:lines_def,flagged_def_lines:flagged,k_after:k1,keystone:ksl?('D'+ksl+' '+kss+(ks2!==kss?' -> '+ks2:'')):null,
  opt1:c1?c1.split('-')[0]:null,opt1_clause:c1,changed:c1?c1.split('-')[0]!==r.tag:null,
  opt2_counted:flagged===0, // option 2: a seat with any uncured DEFENDER ground is not counted
  opt3_calls:(k1!==kB.length)?1:0}); // option 3: a re-grade call to the seat whenever a removed ground changes k
}
console.log('TOTAL defender BROKEN lines',out.reduce((a,x)=>a+x.def_broken_lines,0),'flagged',out.reduce((a,x)=>a+x.flagged_def_lines,0),'| seats keeping a BROKEN link',out.filter(x=>x.k_after>0).length,'of',out.length);
const panel=src=>src==='27259'?'27259':(+src.split(' ')[1]<=235?'replays 233-235':'replays 236-238');
const maj=tags=>{const c={};tags.forEach(t=>c[t]=(c[t]||0)+1);const s=Object.entries(c).sort((a,b)=>b[1]-a[1]);return (tags.length<2||(s[1]&&s[1][1]===s[0][1]))?'CONTESTED':s[0][0];};
const OUT={HELD:'DEFENDER PREVAILS',BROKEN:'CHALLENGER PREVAILS',PARTIAL:'DEFENDER PREVAILS, WEAKENED',CONTESTED:'UNGRADED — REVIEW'};
for(const x of out)console.log(JSON.stringify(x));
for(const p of [...new Set(out.map(x=>panel(x.src)))]){const s=out.filter(x=>panel(x.src)===p);
 // Option 1b: as 1, but a seat whose k fell to 0 only by removal is held UNDERDETERMINED; the live tie rule (derive_debate_outcome) then gives
 // UNDERDETERMINED when the panel is HELD and most counted HELD seats are UNDERDETERMINED.
 const f1=maj(s.map(x=>x.opt1||x.tag));const H=s.filter(x=>(x.opt1||x.tag)==='HELD');const HU=H.filter(x=>x.changed&&x.k_after===0);
 const o1b=(f1==='HELD'&&HU.length*2>H.length)?'UNDERDETERMINED':OUT[f1];
 console.log('PANEL',p,'| now:',OUT[maj(s.map(x=>x.tag))],'| opt1:',OUT[f1],'| opt1b:',o1b,'| opt2:',OUT[maj(s.filter(x=>x.opt2_counted).map(x=>x.tag))],'('+s.filter(x=>x.opt2_counted).length+' counted)','| opt3 calls:',s.reduce((a,x)=>a+x.opt3_calls,0));}
