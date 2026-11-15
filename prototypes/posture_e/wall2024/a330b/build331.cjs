// ASK 331 build: Option A one test (ruling 461), send-back record paths and E-GATE rows. Shared Library only. Input: target_330.json.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'target_330.json',OUT=process.argv[3]||'target_331.json';
const d=JSON.parse(fs.readFileSync(IN));const U=T.unpack(d);const L=U.L,M=U.M;
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const has=(k,i)=>M[k].p.some(e=>typeof e==='number'?e===i:(typeof e[0]==='number'&&e[0]<=i&&i<=e[1]));
const SB=Object.keys(M).filter(k=>has(k,2800)),GC=Object.keys(M).filter(k=>has(k,1815)&&has(k,3466)),GR=Object.keys(M).filter(k=>has(k,1929));
if(SB.length!==3||GC.length!==6||GR.length!==3||!GR.every(k=>GC.includes(k)))throw new Error('map '+SB.length+' '+GC.length+' '+GR.length);
const RW="rows[rows.length-1]";
// send-back record: every counted list
L[2794]=once(L[2794],"{(ECF[b.seat]=ECF[b.seat]||[]).push(","{if(!__oaSkip(it,a,"+RW+",b.seat))(ECF[b.seat]=ECF[b.seat]||[]).push(",'2794');
L[2798]=once(L[2798],"{(UNDF[b.seat]=UNDF[b.seat]||[]).push(","{if(!__oaSkip(it,a,"+RW+",b.seat))(UNDF[b.seat]=UNDF[b.seat]||[]).push(",'2798');
for(const [i,mp] of [[2800,'ABSM'],[2802,'PABM'],[2804,'MNPM'],[2806,'IMPM'],[2808,'KSCM'],[2810,'B7M']])
 L[i]=once(L[i],"if("+RW+".cure_status!=='UNCURED')("+mp+"[b.seat]=","if("+RW+".cure_status!=='UNCURED'&&!__oaSkip(it,a,"+RW+",b.seat))("+mp+"[b.seat]=",String(i));
// E-GATE: same test on a gate CHANGE TO whose item line is the judge's own line
L[3466]=" {const __nl=s=>String(s==null?'':s).replace(/\\\\+\"/g,'\"').replace(/\\\\n/g,' ').replace(/[*_`]+/g,'').replace(/\\s+/g,' ').trim();const __rw=__nl(raw);for(const r of res){if(r.cured||!r.live||r.ans!=='CHANGE'||!applied.has(r.gid)||r.src==='K re-read')continue;const x=G.find(q=>q.gid===r.gid);const l0=x&&(x.lines||[])[0];if(!l0||!__nl(l0)||!__rw.includes(__nl(l0)))continue;const o=__oa331(l0,r.to);if(o.ok){r.oa=true;r.why=String(r.why)+' [OPTION A (ASK 331, ruling 461): '+o.why+'; the row stays UNCURED and is off the drv_uncured tally; it removes no seat]';}}} /* pkgOPA */\n"+L[3466];
L[3467]=once(L[3467],"uncured:res.filter(r=>!r.cured&&r.live).length","uncured:res.filter(r=>!r.cured&&r.live&&!r.oa).length",'3467');
L[1929]=once(L[1929],"(r.cured?'':(C&&r.live?'; counted in drv_uncured':'; RECORD-ONLY, not counted'))","(r.cured?'':(C&&r.live&&r.oa?'; OPTION A (ASK 331): off the drv_uncured tally':C&&r.live?'; counted in drv_uncured':'; RECORD-ONLY, not counted'))",'1929');
L[1932]=once(L[1932],"(r.cured?'':(C&&r.live?' (counted in drv_uncured)':' (RECORD-ONLY)'))","(r.cured?'':(C&&r.live&&r.oa?' (OPTION A, ASK 331: off the drv_uncured tally)':C&&r.live?' (counted in drv_uncured)':' (RECORD-ONLY)'))",'1932');
const NL=L.length;L.push(fs.readFileSync(__dirname+'/oa331.js','utf8').trim());
const TOUCH=[...new Set([...SB,...GC])];for(const k of TOUCH)M[k].p.push(NL);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
for(const k of Object.keys(M)){const s=T.rb(L,M[k]);let ast;try{ast=acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){throw new Error('parse '+k+': '+e.message);}
 if(TOUCH.includes(k)&&!['__oa331','__oaSkip','__oaRaw'].every(f=>ast.body.some(x=>x.type==='FunctionDeclaration'&&x.id.name===f)))throw new Error('helpers not top-level in '+k);}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('touched',TOUCH.join(', '),'| MAP changed',ch.length,'lines',L.length,'lib sha',lsha,'node sha',cr.createHash('sha256').update(sl.parameters.jsCode).digest('hex').slice(0,12));
