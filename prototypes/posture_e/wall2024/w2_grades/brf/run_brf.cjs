// W2 grade harness for pkgBRF: C4P (refs/fresh/of/ofD) and REFP from each of the 12 nodes, live vs candidate.
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));
const LIVE=W(process.env.LIVE||'/mnt/project-files/wall2024/fetchback_live_s114.json'),CAND=W(process.env.CAND||'/mnt/project-files/wall2024/parent_s114_BRF3.json');
const NODES=['Build Synthesis','Build Independent Verdict','Build Save Body','Panel Build','Format Markdown','D4 Build','D4 Extract','C4 Build','C4 Extract','C4G Extract','D4B Extract','C4B Extract'];
const mk=s=>{const a=s.indexOf('const REFP=');const b=s.indexOf('const C4P=(()=>{');if(a<0||b<0)return null;const e=s.indexOf('})();',s.indexOf('return {refs,fresh',b))+5;
 const re=s.indexOf('})();',s.indexOf('return {parse,keys',a))+5;const body=s.slice(a,re)+'\n'+s.slice(b,e)+'\nreturn {REFP,C4P};';return new Function('$','__L',body)(()=>({first:()=>({json:{}})}),{});};
const H={};for(const [tag,w] of [['live',LIVE],['cand',CAND]])for(const n of NODES){const c=w.nodes.find(x=>x.name===n).parameters.jsCode;try{H[tag+'|'+n]=mk(c);}catch(e){H[tag+'|'+n]='ERR '+e.message.slice(0,80);}}
const bad=Object.entries(H).filter(([k,v])=>!v||typeof v==='string');if(bad.length)console.log('harness fail',bad.map(x=>x[0]+' '+x[1]).join('; '));
const of=(h,p)=>p.F?h.C4P.of(p.F):h.C4P.ofD(p.FD);
// plants
let pf=0,pc=0;for(const p of JSON.parse(fs.readFileSync(__dirname+'/plants_brf.json'))){for(const n of NODES){for(const t of ['live','cand']){const h=H[t+'|'+n];if(typeof h!=='object')continue;const got=of(h,p);pc++;const ok=JSON.stringify(got)===JSON.stringify(p[t]);if(!ok){pf++;console.log('PLANT MISMATCH',p.id,t,n,JSON.stringify(got),'expected',JSON.stringify(p[t]));}}}}
console.log('plant checks',pc,'mismatches',pf);
// stored: build F from inputs/ Extract labelled fields
const d='/mnt/project-files/wall2024/inputs/';const lab=(r,n)=>{try{const j=JSON.parse(fs.readFileSync(d+r+'_'+n+'_Extract.json'));const x=(Array.isArray(j)?j[0]:j);const o=(x.data||x).main[0][0].json;return o.labelled||'';}catch(e){return null;}};
const runs=[...new Set(fs.readdirSync(d).filter(f=>/_C4B_Extract\.json$/.test(f)).map(f=>f.split('_')[0]))];let eqP=0,eqD=0,dP=[],dD=[],n0=0;
const h0=H['live|Build Synthesis'],h1=H['cand|Build Synthesis'];
for(const r of runs){const F={cr1:lab(r,'D1'),gr1:lab(r,'C1B'),cr2:lab(r,'D2B'),gr2:lab(r,'C2B'),cr3:lab(r,'D3B'),dr3:lab(r,'C3B'),cr4:lab(r,'D4B'),dr4:lab(r,'C4B')};if(Object.values(F).some(v=>v==null)){n0++;continue;}
 const a=h0.C4P.of(F),b=h1.C4P.of(F);JSON.stringify(a)===JSON.stringify(b)?eqP++:dP.push(r+' press: live '+JSON.stringify(a)+' cand '+JSON.stringify(b));
 const c=h0.C4P.ofD(F),e=h1.C4P.ofD(F);JSON.stringify(c)===JSON.stringify(e)?eqD++:dD.push(r+' CR4: live '+JSON.stringify(c)+' cand '+JSON.stringify(e));
 for(const n of NODES.slice(1)){const x=H['cand|'+n];if(typeof x!=='object')continue;if(JSON.stringify(x.C4P.of(F))!==JSON.stringify(b)||JSON.stringify(x.C4P.ofD(F))!==JSON.stringify(e))console.log('NODE DISAGREES',r,n);}}
console.log('stored runs',runs.length,'skipped',n0,'press equal',eqP,'CR4 equal',eqD);dP.forEach(x=>console.log(' ',x));dD.forEach(x=>console.log(' ',x));
