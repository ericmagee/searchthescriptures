// pkgMIM test. Run from wall2024/: node pkgMIM/test_MIM.cjs
// Saved runs: Init Seats -> Resolve Seats -> Alternate Build (base s44 vs patched chain). Checks: panel, reserve and single judge unchanged; alt_order
// becomes [..., grok, mimo]; Resolve Seats' alternates list mimo after grok with family xiaomi and an OpenRouter id; Alternate Build seats grok first
// exactly as before; a second removed seat (simulated) is offered mimo; mimo passes G2-G4; mimo's body carries reasoning {enabled:false}.
// Accept Build: one more posture item, for mimo, with the flag.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s44.json';const W=JSON.parse(fs.readFileSync(B));
const D='/mnt/project-files/wall2024/inputs/';const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;const pat=n=>fs.existsSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js')?fs.readFileSync(__dirname+'/patched/'+n.replace(/ /g,'_')+'.js','utf8'):live(n);
const AW=c=>'return (async()=>{'+c+'\n})();';
let ok=0,bad=0;const out=[];const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;out.push('FAIL '+m);}console.log((c?'OK ':'FAIL ')+m);};
const runs=fs.readdirSync(D).filter(f=>/_Init_Seats\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
(async()=>{for(const R of runs){let i0,i1,e0=null,e1=null;try{i0=harness(R)(live('Init Seats'),fin(R,'Init Seats'));}catch(e){e0=e.message.slice(0,90);}try{i1=harness(R)(pat('Init Seats'),fin(R,'Init Seats'));}catch(e){e1=e.message.slice(0,90);}if(e0||e1){T(String(e0).replace(/run_token=\S+/,'')===String(e1).replace(/run_token=\S+/,''),R+' Init Seats refuses the same way on base and patched (saved input): '+e0);continue;}
 const a=i0[0].json,b=i1[0].json;
 T(JSON.stringify(a.panel_order)===JSON.stringify(b.panel_order)&&a.panel_reserve===b.panel_reserve&&a.single_judge===b.single_judge,R+' panel '+JSON.stringify(b.panel_order)+', reserve '+b.panel_reserve+', single '+b.single_judge+' unchanged');
 T(JSON.stringify(b.alt_order)===JSON.stringify([...(a.alt_order||[]),'mimo']),R+' alt_order '+JSON.stringify(a.alt_order)+' -> '+JSON.stringify(b.alt_order));
 if(!has(R,'Resolve Seats'))continue;const rf=fin(R,'Resolve Seats');let r0,r1;try{r0=harness(R)(live('Resolve Seats'),rf);r1=harness(R,{'Init Seats':i1})(live('Resolve Seats'),rf);}catch(e){T(false,R+' Resolve Seats threw '+e.message.slice(0,120));continue;}
 const A0=r0[0].json.alternates||[],A1=r1[0].json.alternates||[];const mm=A1.find(x=>x.seat==='mimo');
 T(A1.length===A0.length+1&&!!mm&&A1[A1.length-1].seat==='mimo'&&mm.family==='xiaomi'&&/^xiaomi\//.test(mm.api_model),R+' alternates '+JSON.stringify(A0.map(x=>x.seat))+' -> '+JSON.stringify(A1.map(x=>x.seat))+(mm?' (mimo '+mm.api_model+', family '+mm.family+', max_tokens '+mm.max_tokens+')':''));
 if(!has(R,'Alternate Build'))continue;const af=fin(R,'Alternate Build');let b0,b1,b2;try{b0=await harness(R)(AW(live('Alternate Build')),af);b1=await harness(R,{'Init Seats':i1,'Resolve Seats':r1})(AW(pat('Alternate Build')),af);const r2=JSON.parse(JSON.stringify(r1));r2[0].json.alternates=r2[0].json.alternates.filter(x=>x.seat==='mimo');b2=await harness(R,{'Init Seats':i1,'Resolve Seats':r2})(AW(pat('Alternate Build')),af);}catch(e){T(false,R+' Alternate Build threw '+e.message.slice(0,120));continue;}
 const s0=b0.map(x=>x.json.alt).filter(Boolean).map(x=>(x.seat||'')+(x.skip?' SKIP '+x.skip.slice(0,60):'')),s1=b1.map(x=>x.json.alt).filter(Boolean).map(x=>(x.seat||'')+(x.skip?' SKIP '+x.skip.slice(0,60):''));
 T(JSON.stringify(s0)===JSON.stringify(s1)||s0.every((x,k)=>/SKIP/.test(x)||x===s1[k]),R+' Alternate Build seats '+JSON.stringify(s0)+' -> '+JSON.stringify(s1));
 const g2=b2.map(x=>x.json.alt).filter(Boolean);if(s0.some(x=>!/SKIP/.test(x)))T(g2.some(x=>x.pool_seat==='mimo'&&!x.skip),R+' pool of mimo alone (grok taken): the removed seat is offered mimo, guards G1-G4 pass: '+JSON.stringify(g2.map(x=>(x.seat||'')+(x.skip?' SKIP '+x.skip.slice(0,120):''))));
 const mi=[...b1,...b2].map(x=>x.json.alt).find(x=>x&&x.pool_seat==='mimo');if(mi)T(mi.body&&mi.body.reasoning&&mi.body.reasoning.enabled===false,R+' mimo body carries reasoning {enabled:false}');}
// guard check: mimo through G2-G4 with the Alternate Build guard function, on a 33345 shape where grok is already offered
{const c=pat('Alternate Build');const k=c.indexOf("return 'G2: '");const st=c.lastIndexOf('const ',k);console.log('guard source:',c.slice(st,st+120).replace(/\n/g,' '));}
// Accept Build
for(const R of ['33345','33371']){if(!has(R,'Accept Build'))continue;const f=fin(R,'Accept Build');const a0=harness(R)(live('Accept Build'),f),a1=harness(R)(pat('Accept Build'),f);
 const s0=a0.map(x=>x.json.acc&&x.json.acc.seat),s1=a1.map(x=>x.json.acc&&x.json.acc.seat);const m=a1.map(x=>x.json.acc).find(x=>x&&x.seat==='mimo');
 T(s1.length===s0.length+1&&!!m&&m.body.reasoning&&m.body.reasoning.enabled===false&&/^xiaomi\//.test(m.body.model),R+' Accept Build seats '+JSON.stringify(s0)+' -> '+JSON.stringify(s1)+(m?' (mimo '+m.body.model+', max_tokens '+m.body.max_tokens+')':''));}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_MIM.txt',out.join('\n')+'\n');})();
