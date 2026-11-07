// pkgEID2 test. Run from wall2024/: node pkgEID2/test_EID2.cjs
// 1. 33411: Alt call 2's 13 "grok (Hn)" lines read (NO VERDICT 13 -> 0), and every row the base read is unchanged.
// 2. Replay, every saved run 33218+, both sides: rows equal to base except rows that were NO VERDICT on base and are now read.
// 3. Units: seat-first with a full id, with a bare id (one item / two items), and a line that names a seat only (unchanged).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const B=process.env.EB||'pkgEB7/patched_full/',P=__dirname+'/patched/';
const rf=(d,n)=>fs.readFileSync(d+n.replace(/ /g,'_')+'.js','utf8');let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x);const key=x=>x.seat+'|'+x.item+'|'+x.flagged_line+'|'+x.rule;const NV=x=>/^ENFORCER NO VERDICT/.test(x.cure_reason||'');
const runs=fs.readdirSync(D).filter(f=>/^\d+_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
for(const RUN of runs)for(const [jr,jc] of [['Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){
 if(!fs.existsSync(D+RUN+'_'+jc.replace(/ /g,'_')+'.json'))continue;let a,b,e0=null,e1=null;
 try{a=harness(RUN)(rf(B,jr),jc)[0].json;}catch(e){e0=String(e.message).slice(0,90);}try{b=harness(RUN)(rf(P,jr),jc)[0].json;}catch(e){e1=String(e.message).slice(0,90);}
 if(e0||e1){T(e0===e1,RUN+' '+jr+': same error on base and patched ('+e0+')');continue;}
 const ra=a.enf428_rows||[],rb=b.enf428_rows||[];const mb=new Map(rb.map(x=>[key(x),x]));let changed=0,fixed=0,other=0;
 for(const x of ra){const y=mb.get(key(x));if(st(x)===st(y))continue;changed++;if(NV(x)&&y&&!NV(y))fixed++;else other++;}
 const nva=ra.filter(NV).length,nvb=rb.filter(NV).length;
 T(ra.length===rb.length&&other===0,RUN+' '+jr+': rows '+ra.length+', NO VERDICT '+nva+' -> '+nvb+', rows newly read '+fixed+', other rows changed '+other+(b.enf428&&b.enf428.eid&&b.enf428.eid.seat_first?', seat_first '+b.enf428.eid.seat_first:''));
 if(RUN==='33411'&&/^Alt/.test(jr))T(nva===13&&nvb===0,'33411 Alt: the 13 grok items are read');}
// units: on the patched line normaliser
const src=rf(P,'Judge Enforcer Record');const re=new Function('return '+src.match(/\.replace\((\/\^\(ENFORCER[^]*?\/i),\(x,a,b\)/)[1])();const nz=s=>s.replace(re,(x,a,b)=>a+b);
for(const [s,w] of [['ENFORCER: grok (H1) -- AGREE -- RIGHT: STANDS -- x','ENFORCER: H1 -- AGREE -- RIGHT: STANDS -- x'],['ENFORCER: gemini (P1.1) -- DISAGREE -- x','ENFORCER: P1.1 -- DISAGREE -- x'],['ENFORCER: P1.1 (gemini) -- AGREE -- x','ENFORCER: P1.1 (gemini) -- AGREE -- x'],['ENFORCER: gemini -- AGREE -- x','ENFORCER: gemini -- AGREE -- x'],['ENFORCER: judge grok (S2.1) -- AGREE -- x','ENFORCER: S2.1 -- AGREE -- x']])T(nz(s)===w,'unit '+JSON.stringify(s.slice(0,32))+' -> '+JSON.stringify(nz(s).slice(0,32)));
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EID2.txt',out.join('\n')+'\n');
