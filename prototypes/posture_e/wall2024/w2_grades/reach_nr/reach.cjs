// W2: reach conditions of the packages NOT REACHED on run 35067, measured on stored execution data (offline, no calls).
// Sources: the 11 exports ex*_full.json and the per-node outputs in inputs/.
const fs=require('fs');const W='/mnt/project-files/wall2024/';const H=require('../../pkgEAD/harness_clone.cjs');
const ld=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const code=(fb,n)=>ld(fb).nodes.find(x=>x.name===n).parameters.jsCode;
const REC132=code('fetchback_live_s132.json','Close Enforcer Record'),REC120=code('fetchback_live_s120.json','Close Enforcer Record');
const BS=code('fetchback_live_s132.json','Build Synthesis');
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const EX=fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort();
const exData={};for(const e of EX){const d=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));exData[e]=(d.data||d).resultData.runData;}
const lastOut=(rd,n)=>{const r=rd[n];if(!r)return null;return (r[r.length-1].data.main[0]||[]);};
const allReplies=(rd,n)=>{const r=rd[n];if(!r)return [];const t=[];for(const x of r)for(const br of (x.data&&x.data.main)||[])for(const it of br||[]){const c=it.json&&it.json.choices&&it.json.choices[0]&&it.json.choices[0].message&&it.json.choices[0].message.content;if(c)t.push(c);}return t;};
const dbid=e=>{const m=fs.readFileSync(W+'ex'+e+'_full.json','utf8').match(/"debate_id":"([0-9a-f-]{36})"/);return m?m[1].slice(0,8):'?';};
(async()=>{
// 1. Close enforcer: labels (RLF, RLF2), grouping (CLG 1), relink (CLK rev 3) and relink guard (CLG 2)
console.log('== CLOSE ENFORCER (exports with a Close Enforcer call)');
for(const e of EX){const rd=exData[e];if(!rd['Close Enforcer Call deepseek'])continue;
 const lines=allReplies(rd,'Close Enforcer Call deepseek').join('\n').split('\n').filter(l=>/^CLOSE-CONTRADICTION:/.test(l.trim()));
 const lab={crn:0,round:0,bare:0};for(const l of lines)for(const m of l.matchAll(/(EARLIER|CLOSING)\s+(\[[^\]]*\]|\S+)/g)){const s=m[2];if(/^\[?(CR|DR)\s*\d\]?$/i.test(s))lab.crn++;else if(/round/i.test(s))lab.round++;else if(/^\[?\d\]?$/.test(s))lab.bare++;}
 const $=n=>{const o=lastOut(rd,n)||[];return {isExecuted:!!rd[n],first:()=>o[0],all:()=>o,item:o[0]};};
 const inp=lastOut(rd,'Close Enforcer Call deepseek');let a,b;
 try{a=(await runSrc(REC132,$,inp))[0].json.cec;b=(await runSrc(REC120,$,inp))[0].json.cec;}catch(x){console.log(e,'replay error',x.message);continue;}
 const rows=a.rows||[],rows0=b.rows||[];
 const conflict=rows.filter(r=>/conflicting/.test(r.status||'')).length;
 const relink=rows.filter(r=>r.relink||/set by the code/.test(r.note||'')).length;
 const relink0=rows0.filter(r=>r.relink||/set by the code/.test(r.note||'')).length;
 const guard=rows.filter((r,i)=>rows0[i]&&rows0[i].id===r.id&&rows0[i].link!==r.link&&!/conflicting/.test(r.status||'')).length;
 const stored=JSON.stringify(lastOut(rd,'Close Enforcer Record')[0].json.cec.rows);
 console.log(e,'debate',dbid(e),'| lines',lines.length,'labels',JSON.stringify(lab),'| s132 rows',rows.length,'conflicting',conflict,'relink set',relink,'| s120 relink set',relink0,'link differs s120 vs s132',guard,'| s132 replay equals stored',JSON.stringify(rows)===stored);}
// 2. Anticheat lines ending with a period after the last quote mark (pkgACM)
console.log('== ANTICHEAT (pkgACM): answer lines ending \'".\'');
const acRuns=new Set(fs.readdirSync(H.IN).filter(f=>/_Anticheat_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]));
let acTot=0,acHit=0;const acList=[];
const acCheck=(id,txts)=>{acTot++;let n=0;for(const t of txts)for(const l of t.split('\n'))if(/^\s*ANTICHEAT:/.test(l)&&/"\.\s*$/.test(l))n++;if(n){acHit++;acList.push(id+':'+n);}};
for(const e of EX)if(exData[e]['Anticheat Call deepseek'])acCheck('ex'+e,allReplies(exData[e],'Anticheat Call deepseek'));
for(const r of [...acRuns].sort()){if(EX.includes(r))continue;const o=H.out(r,'Anticheat Call deepseek')||[];const t=[];for(const br of o)for(const it of br||[]){const c=it&&it.json&&it.json.choices&&it.json.choices[0].message.content;if(c)t.push(c);}acCheck(r,t);}
console.log('runs with an Anticheat call',acTot,'runs with a period line',acHit,acList.join(' '));
// 3. pkgBRF rev 5: close-round book line naming two or more earlier books
console.log('== CLOSE-ROUND BOOK CHECK (pkgBRF rev 5)');
const k=BS.indexOf('const REFP=');const ke=BS.indexOf('})();',k)+5;const i=BS.indexOf('const C4P=');const ie=BS.indexOf('})();',i)+5;
const R=new Function(BS.slice(k,ke)+'\n'+BS.slice(i,ie)+'\nreturn {REFP,C4P};')();
const Fs=new Map();const walk=(id,v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(id,x,d+1));return;}if(typeof v.dr4==='string'&&typeof v.gr1==='string'&&typeof v.cr4==='string'){if(!Fs.has(id))Fs.set(id,v);return;}for(const q in v)walk(id,v[q],d+1);};
for(const e of EX)for(const n in exData[e])walk('ex'+e,exData[e][n],0);
const bsRuns=new Set(fs.readdirSync(H.IN).map(f=>f.split('_')[0]));
for(const r of [...bsRuns].sort()){if(EX.includes(r))continue;for(const f of fs.readdirSync(H.IN).filter(f=>f.startsWith(r+'_'))){if(Fs.has(r))break;try{walk(r,JSON.parse(fs.readFileSync(H.IN+'/'+f,'utf8')),0);}catch(x){}}}
let bt=0,b4=0,b5=0;const bl=[];
for(const [id,F] of Fs){bt++;let note='';try{note=R.C4P.note(F)||'';}catch(x){note='ERR '+x.message;}
 const one=note.match(/\(([^()]*?) named earlier\)/g)||[];const multi=one.filter(s=>/, /.test(s));if(one.length)b4++;if(multi.length){b5++;bl.push(id+' '+multi.join(' '));}}
console.log('runs with F (cr4, dr4)',bt,'| runs with a book line (rev 4 path)',b4,'| runs with a line naming two or more books (rev 5 path)',b5);for(const s of bl)console.log('  ',s.slice(0,300));
})();
