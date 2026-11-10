// pkgGCP plants on the 34626 chain (stored replies). A counted cure line is added to luna's judgment after Panel Cure Check (drv +1), then the chain runs on.
// usage: node pkgGCP/plant.cjs <candidate>
const chain=require('../pkgKSR/w3_grade/chain.cjs');const L=require('./glib.cjs');const W=process.argv[2]||'pkgGCP/parent_s110_GCP.json';
const cnt=o=>(o.bodies||[]).map(j=>{const p=JSON.parse(j).payload;return p.judge_seat+':'+(p.drv_uncured||0)}).join(' ');
const lineOf=(raw,pair)=>raw.split('\n').find(l=>l.replace(/^[\s*-]+/,'').startsWith(pair+' ('))||'';
const P=[
 ['A  K-B D6 vs C6, its line replaced by S8/S9, raised before, not after (expect off)','K-B','D6 vs C6','D6 vs C6',''],
 ['B  K-B D6 vs C5 (on s111 its line is not replaced and still raised after: expect stays; on s110 replaced: expect off)','K-B','D6 vs C5','D6 vs C5',''],
 ['C  K-B D6 vs C6 but LINE of D1 vs C1, never replaced (expect stays)','K-B','D6 vs C6','D1 vs C1',''],
 ['D  K-S3 #1, raised before and after (expect stays)','K-S3','S3 DEFENDER CR4: #1','D6 vs C6',''],
 ['E  K-B D6 vs C6 silent: WHY no written response (expect stays)','K-B','D6 vs C6','D6 vs C6','; WHY: no written response'],
 ['F  K-C on D6 vs C6, NOT COUNTED (expect stays; drv not raised by the cure)','K-C','D6 vs C6','D6 vs C6','; NOT COUNTED (K-C UNCURED)'],
 ['G  K-RUL TRIAL on D6 vs C6 (expect stays)','K-RUL','D6 vs C6','D6 vs C6',''],
 ['H  K-G4 D4 vs C2: line replaced, not raised before, raised after (expect stays)','K-G4','D4 vs C2','D4 vs C2',''],
 ['I  two lines for A and B (expect off 1 on s111, 2 on s110)','K-B','D6 vs C6','D6 vs C6','',['K-B','D6 vs C5','D6 vs C5','']],
 ['J  the same item twice (A twice; expect off 1: one item, drv +2 planted)','K-B','D6 vs C6','D6 vs C6','',['K-B','D6 vs C6','D6 vs C6','']]];
(async()=>{const mode=process.argv[3]||'gate';
 const base=await chain(W,{});const st=r=>['Panel Cure Check','Send Back Record','Gate Record'].map(n=>n+' ['+cnt(r.over[n][0][0].json)+']').join(' | ');
 console.log('CANDIDATE',W,'MODE',mode,'\nCONTROL:',st(base),'\n  rows:',base.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' '));
 const skipHook={'Gate Build':(over)=>{over['Gate Build']=[[{json:{gate_skip:true,gate_why:'PLANT: gate skipped',gate_report:[]}}]];}};
 for(const [name,...spec] of P){const items=[spec.slice(0,4)].concat(spec.length>4?[spec[4]]:[]);
  const r=await chain(W,{after:Object.assign({'Panel Cure Check':(over)=>{const J=over['Panel Cure Check'][0][0].json;const i=J.bodies.findIndex(s=>JSON.parse(s).payload.judge_seat==='luna');const b=JSON.parse(J.bodies[i]);const G=L(()=>null);
   for(const [rule,item,lpair,extra] of items){const ln=G.cureSafe(lineOf(G.cureJText(b.payload.verdict_raw,true),lpair)).replace(/\s+/g,' ').trim().slice(0,300);
    b.payload.verdict_raw+='\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: luna; ITEM: '+item+'; RULE: '+rule+'; RESULT: UNCURED'+extra+'; LINE: '+ln+'; JUDGE STATEMENT: the line stands as written]';if(!/NOT COUNTED/.test(extra)&&rule!=='K-RUL')b.payload.drv_uncured=(b.payload.drv_uncured||0)+1;}
   J.bodies[i]=JSON.stringify(b);}},mode==='skip'?skipHook:{})});
  const lu=r.rows.find(x=>(x.judge_seat||x.seat)==='luna');const off=(lu.verdict_raw.match(/\[AUDIT v52: CURE COUNT OFF[^\]]*\]/g)||[]);
  console.log('\n'+name+'\n  '+st(r)+'\n  rows: '+r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' ')+'\n  gate skipped: '+!!(r.over['Gate Record'][0][0].json.gate||{}).skipped+'\n  marks: '+(off.length?off.join('\n         '):'none'));}
})().catch(e=>{console.error(e);process.exit(1)});
