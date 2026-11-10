// W2 grade of pkgGCP rev 1b: extra plants on the 34626 chain (stored replies), built on W1's plant.cjs.
// usage: node w2_grades/gcp/w2_gcp_plants.cjs <candidate> [gate|skip]
const chain=require('../../pkgKSR/w3_grade/chain.cjs');const L=require('../../pkgGCP/glib.cjs');const W=process.argv[2];const mode=process.argv[3]||'gate';
const cnt=o=>(o.bodies||[]).map(j=>{const p=JSON.parse(j).payload;return p.judge_seat+':'+(p.drv_uncured||0)}).join(' ');
const lineOf=(raw,pair)=>raw.split('\n').find(l=>l.replace(/^[\s*-]+/,'').startsWith(pair+' ('))||'';
const LONG=l=>l.length>300?l.slice(0,297)+'...':l; // the engine's own LINE form (Cure Check)
// [name, seat, rule, item, line pair, extra, opts]
const P=[
 ['W1 luna A, engine LINE form (297 + "...")','luna','K-B','D6 vs C6','D6 vs C6','',{eng:true}],
 ['W2 luna A, WHY text and a STATEMENT field before JUDGE STATEMENT (stored form, 362 rows)','luna','K-B','D6 vs C6','D6 vs C6','; WHY: the grade rests on a premise with no ground',{eng:true,st:true}],
 ['W3 luna A, LINE shorter than 80 after N (first 40 chars of the line)','luna','K-B','D6 vs C6','D6 vs C6','',{cut:40}],
 ['W4 luna A, but luna has no send-back items (no applied change; expect stays)','luna','K-B','D6 vs C6','D6 vs C6','',{noitems:true}],
 ['W5 sol, item D6 vs C6 with sol\'s own D6 vs C6 line','sol','K-B','D6 vs C6','D6 vs C6','',{eng:true}],
 ['W6 chatgpt (no send-back items), A form (expect stays)','chatgpt','K-B','D6 vs C6','D6 vs C6','',{eng:true}],
 ['W7 luna A, RESULT: CURED (expect stays, nothing counted)','luna','K-B','D6 vs C6','D6 vs C6','',{eng:true,cured:true}],
 ['W8 luna A, seat name in the line differs (SEAT: sol written in luna\'s body; expect off by body seat)','luna','K-B','D6 vs C6','D6 vs C6','',{eng:true,seatTag:'sol'}],
 ['W9 luna A with drv not raised (count 0 room; floor check)','luna','K-B','D6 vs C6','D6 vs C6','',{eng:true,noinc:true}]];
(async()=>{const st=r=>['Panel Cure Check','Send Back Record','Gate Record'].map(n=>n+' ['+cnt(r.over[n][0][0].json)+']').join(' | ');
 const base=await chain(W,{});console.log('CANDIDATE',W,'MODE',mode,'\nCONTROL:',st(base),'\n  rows:',base.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' '));
 const skipHook={'Gate Build':(over)=>{over['Gate Build']=[[{json:{gate_skip:true,gate_why:'PLANT: gate skipped',gate_report:[]}}]];}};
 for(const [name,seat,rule,item,lpair,extra,o] of P){const hooks={'Panel Cure Check':(over)=>{const J=over['Panel Cure Check'][0][0].json;const i=J.bodies.findIndex(s=>JSON.parse(s).payload.judge_seat===seat);if(i<0){console.log('  no body for',seat);return;}const b=JSON.parse(J.bodies[i]);const G=L(()=>null);
    let ln=G.cureSafe(lineOf(G.cureJText(b.payload.verdict_raw,true),lpair)).replace(/\s+/g,' ').trim();ln=o.cut?ln.slice(0,o.cut):o.eng?LONG(ln):ln.slice(0,300);
    b.payload.verdict_raw+='\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: '+(o.seatTag||seat)+'; ITEM: '+item+'; RULE: '+rule+'; RESULT: '+(o.cured?'CURED':'UNCURED')+extra+'; LINE: '+ln+(o.st?'; STATEMENT: RESTATED: '+lpair+' (x): STANDS':'')+'; JUDGE STATEMENT: the line stands as written]';
    if(!o.cured&&!o.noinc)b.payload.drv_uncured=(b.payload.drv_uncured||0)+1;J.bodies[i]=JSON.stringify(b);}};
  if(o.noitems)hooks['Send Back Record']=(over)=>{const J=over['Send Back Record'][0][0].json;J.sb_items=(J.sb_items||[]).filter(x=>x.seat!==seat);};
  if(mode==='skip')Object.assign(hooks,skipHook);
  let r;try{r=await chain(W,{after:hooks});}catch(e){console.log('\n'+name+'\n  ERR '+e.message.slice(0,300));continue;}
  const off=[].concat(...r.rows.map(x=>(x.verdict_raw.match(/\[AUDIT v52: CURE COUNT OFF[^\]]*\]/g)||[])));
  console.log('\n'+name+'\n  '+st(r)+'\n  rows: '+r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' ')+'\n  marks: '+(off.length?off.join('\n         '):'none'));}
})().catch(e=>{console.error(e);process.exit(1)});
