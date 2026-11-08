// pkgEAK (W2, 11-08; W2 3107 item 3, W3 3109 lane 1 (c)): a seated alternate's K-W and K-S3 cure answers get the DeepSeek K-W check the panel gets.
// Enforcer Build runs before any alternate is seated and reads only Panel Cure Normalize 1-3, so 27 of 27 seated alternates had 0 K-W checks.
// Alt Judge Enforcer Build adds one more DeepSeek call item: the K-W prompt built by Enforcer Build's own code (copied byte for byte, then
// relabelled W<k>.<n>), over the alternate's rows in Alternate Merge Seat's enforcer_log. Alt Judge Enforcer Record reads W ids and tallies
// K-W/K-S3; Retry Build splits it like any call. TRIAL as for the panel (ruling 421); Alt Send Back Build already sends no K-W row back.
// Run from wall2024/: node pkgEAK/build_EAK.cjs   (bases: live s58 for Record and Retry; pkgEKD/patched for Alt Judge Enforcer Build)
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s58.json','utf8'));const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const one=(s,a,f)=>{if(s.split(a).length!==2)throw new Error(f+' anchor: '+a.slice(0,60));};
// 1. the K-W builder, cut from live Enforcer Build
const EB=live('Enforcer Build');const a0="const clean=s=>String(s||'').replace(/[*_`]+/g,'');",a1="const USER=RULES+'\\n\\n'+parts.join('\\n\\n');";one(EB,a0,'EB');one(EB,a1,'EB');
let seg=EB.slice(EB.indexOf(a0),EB.indexOf(a1));
const sub=(a,b)=>{one(seg,a,'seg');seg=seg.replace(a,()=>b);};
sub("for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if(__L[n]().isExecuted)","for(const n of ['Alternate Cure Normalize']){try{if(__L[n]().isExecuted)");
sub("const id='A'+(k+1)+'.'+(j+1);","const id='W'+(k+1)+'.'+(j+1);");
sub("return 'ITEM '+(k+1)+' OF '+G.length+' ('+g.rule+', '+g.item+'):\\nAnswer each of: '+g.ans.map((r,j)=>'A'+(k+1)+'.'+(j+1)).join(', ')","return 'ITEM W'+(k+1)+' ('+g.rule+', '+g.item+'):\\nAnswer each of: '+g.ans.map((r,j)=>'W'+(k+1)+'.'+(j+1)).join(', ')");
sub("The answer id is the A<item>.<n> label in front of each judge\\'s answer (A1.1, A1.2, ...).","The answer id is the W<item>.<n> label in front of each judge\\'s answer (W1.1, W1.2, ...).");
const FN="/* pkgEAK (W2): the DeepSeek K-W check for the seated alternate's K-W and K-S3 cure answers; Enforcer Build's own builder (pkgEKG text), ids W<k>.<n> */\n"
 +"function eakItems2024(){try{let L=[];try{L=$('Alternate Merge Seat').first().json.enforcer_log||[];}catch(e){L=[];}\n"
 +" const rows=L.filter(r=>r&&r.kind==='cure'&&r.seat_role==='alternate'&&(r.rule==='K-W'||r.rule==='K-S3'));if(!rows.length||!ds)return [];\n"
 +" const R=__eakR;\n"+seg
 +"const USER=RULES+'\\n\\n'+parts.join('\\n\\n');const FORM=s=>{const m=String(s||'').replace(/[*_`\"\\u201c]+/g,'').trim().match(/^(COUNTED|TOUCHES NO LINK|STANDS WITHOUT IT|CONCEDED|NOT HELD|REASSERTED)\\b/i);return m?m[1].toUpperCase():null;};\n"
 +" return [{json:{je_skip:false,eak:true,code_rows:[],call:0,calls:0,model:ds.api_model,run_token:S.run_token,not_checked:[],\n"
 +"  ids:ids.map(x=>({id:x.id,seat:x.row.seat,rule:x.row.rule,item:x.row.item,flagged_line:x.row.flagged_line,response_line:x.row.response_line,grade:FORM(x.row.response_line)||('no form; cure '+(x.row.cure_status||'?'))})),\n"
 +"  body:{model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS+__JAGR},{role:'user',content:USER}]}}}];}catch(e){return [];}}\n";
// 2. Alt Judge Enforcer Build (on pkgEKD)
const plan={nodes:{}};
{const f='Alt_Judge_Enforcer_Build';const s0=fs.readFileSync('pkgEKD/patched/'+f+'.js','utf8');
 const A1="let R=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'])";one(s0,A1,f);
 const A2="return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,";one(s0,A2,f);
 const TAIL="void_rulings:VG.reduce((a,g)=>a+g.rulings.length,0)}}}));";if(!s0.trimEnd().endsWith(TAIL))throw new Error('tail');
 let s=s0.replace(A2,()=>FN+"const __eakR=R;\nreturn [].concat(calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,");
 const t=s.trimEnd();s=t.slice(0,t.length-TAIL.length)+"void_rulings:VG.reduce((a,g)=>a+g.rulings.length,0)}}})),eakItems2024()); /* pkgEAK: the alternate's K-W call goes last */"+s.slice(t.length);
 new Function('$','$input',s);fs.writeFileSync('pkgEAK/patched/'+f+'.js',s);plan.nodes['Alt Judge Enforcer Build']={base:h(s0)+' (pkgEKD)',patched:h(s)};}
// 3. Alt Judge Enforcer Record and Retry Build (live s58)
for(const [nm,n] of [['Alt Judge Enforcer Record',5],['Alt Judge Enforcer Retry Build',1]]){const s0=live(nm);const k=s0.split('[BVKYHZPRS]').length-1;if(k!==n)throw new Error(nm+' letters '+k);
 let s=s0.split('[BVKYHZPRS]').join('[BVKYHZPRSW]');
 if(nm==='Alt Judge Enforcer Record'){const T0="for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES','E-B7'])";one(s,T0,nm);s=s.replace(T0,()=>"for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES','E-B7','K-W','K-S3'])"); /* pkgEAK */}
 new Function('$','$input',s);fs.writeFileSync('pkgEAK/patched/'+nm.replace(/ /g,'_')+'.js',s);plan.nodes[nm]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgEAK/plan_EAK.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
