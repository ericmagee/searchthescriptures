// pkgEPS (W3 Wall 2842; Eric 08:19 CST 11-07: every run carries a fix to the DeepSeek enforcers themselves). ENFORCER fix, side-neutral, in the
// DeepSeek judge-enforcer nodes. The E-PREM push "right: COUNTED (UNEXHIBITED)" caused the false Oracle concedes of 33261 (gemini premises 1, 5)
// and 33311 (gemini premise 4): fit or meaning grounds that named no missing layer, against a block exhibiting [L1], [L2] and [L3].
// (a) Judge Enforcer Build, Alt Judge Enforcer Build: the E-PREM rule says UNEXHIBITED means a missing layer; a COUNTED ruling begins with its kind,
//     (UNEXHIBITED: lacks [Ln]) naming each layer the block lacks, or (CONCEDED) quoting the side's own words that give the premise up; a ground of
//     fit or meaning is graded at the collision, not counted. Each E-PREM item's first id carries the answering block (blk) for the record check.
// (b) Judge Enforcer Record, Alt Judge Enforcer Record: a DISAGREE with RIGHT COUNTED that is not labelled (CONCEDED), names no layer the block lacks
//     (unxLack, copied byte for byte), against a block showing 2 or more layer kinds (lbFoot, copied byte for byte), is HELD:
//     TRIAL (EPS_STATUS 'TRIAL'): recorded only, in a trailing "(TRIAL pkgEPS: ...)" the send-back reason strips, so the judge's input is unchanged.
//     LIVE: the row reads "ENFORCER HELD (pkgEPS, not sent)" and Send Back Build's filter (^ENFORCER DISAGREE|NO ANSWER) does not send it.
// Base: live ae5636d0 (fetchback_live_s39.json); no node overlap with pkgDPT or pkgMEM. Run from wall2024/: node pkgEPS/build_EPS.cjs [--status LIVE] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const FB=arg('--fb','/mnt/project-files/wall2024/fetchback_live_s39.json');const OUT=arg('--out','pkgEPS/patched');const ST=arg('--status','TRIAL');
const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
const LIBSRC=fs.readFileSync(__dirname+'/eps_lib_src.js','utf8');
const B1=["  const ids=CLN[sd].map((x,k)=>({id:'P'+pi+'.'+(k+1),rule:'E-PREM',seat:x.seat,grade:'PREMISE '+n,item:(sd==='D'?'premise listed against the defender':'premise listed against the challenger')+' '+n,flagged_line:x.line.slice(0,1500),response_line:x.line.slice(0,700)}));",
 "  const ids=CLN[sd].map((x,k)=>({id:'P'+pi+'.'+(k+1),rule:'E-PREM',seat:x.seat,grade:'PREMISE '+n,item:(sd==='D'?'premise listed against the defender':'premise listed against the challenger')+' '+n,flagged_line:x.line.slice(0,1500),response_line:x.line.slice(0,700),...(k===0?{blk:a?String(a.t).slice(0,8000):''}:{})})); /* pkgEPS: the block, once per item */"];
const B2=["+'RULE E-RES (a judge","+'RULE E-PREM, THE COUNTED KIND (pkgEPS). UNEXHIBITED means a missing layer: the answering block does not exhibit a layer its footing needs. When your RIGHT is COUNTED, begin your sentence with its kind in brackets: (UNEXHIBITED: lacks [L1]), naming each layer ([L1], [L2] or [L3]) the block does not exhibit; or (CONCEDED), quoting the side\\'s own words that give the premise up. A ground of fit or meaning (the answer does not meet a pressed verse, or reads it another way) is not a missing layer: it is graded at the collision (RULE E-COL, RULE E-HOLD), not counted here, so it is not COUNTED.\\n'\n +'RULE E-RES (a judge"];
const R1=["const tally={};","/* pkgEPS (W3 2842) */const EPS_STATUS='"+ST+"';\n"+LIBSRC+"\nconst __epsBlk={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-PREM'&&typeof x.blk==='string'&&!(x.item in __epsBlk))__epsBlk[x.item]=x.blk;}));\nfunction epsHold(x,v){if(!x||x.rule!=='E-PREM'||!v||v.v!=='DISAGREE'||v.right!=='COUNTED')return null;if(/^\\s*\\(\\s*CONCEDED\\b/i.test(v.why))return null;const blk=__epsBlk[x.item]||'';if(!blk)return null;let k=[];try{k=lbFoot(blk,true);}catch(e){k=[];}if(k.length<2)return null;if(unxLack(v.why,k).missing.length)return null;\n return 'the push counts the premise but names no layer the block lacks; the block exhibits '+k.map(z=>'['+z+']').join(', ');}\nconst tally={};"];
const R2=["  cure_reason:'ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)',at:T});});});",
 "  cure_reason:(()=>{const __h=epsHold(x,v);const base='ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)';if(!__h)return base;const note=__h.replace(/[()]/g,' ');return EPS_STATUS==='LIVE'?base.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEPS, not sent; W3 2842: '+note+')'):base+' (TRIAL pkgEPS: would not be sent: '+note+')';})(),at:T});});});"];
const rep=(s,[a,b],f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const BASE=OUT+'_base';fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(BASE,{recursive:true});const plan={base:FB,status:ST,nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string')continue;let s=null,ed=[];
 if(n.name==='Judge Enforcer Build'||n.name==='Alt Judge Enforcer Build'){s=rep(s0,B1,n.name+' blk');s=rep(s,B2,n.name+' prompt');ed=['blk','prompt'];}
 else if(n.name==='Judge Enforcer Record'||n.name==='Alt Judge Enforcer Record'){s=rep(s0,R1,n.name+' lib');s=rep(s,R2,n.name+' hold');ed=['lib','hold'];}
 else continue;
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync(BASE+'/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:ed});console.log(n.name.padEnd(28),sha(s0),'->',sha(s),ed.join(','));}
if(plan.nodes.length!==4)throw new Error('expected 4 nodes, got '+plan.nodes.length);
fs.writeFileSync(OUT+'/../plan_'+OUT.split('/').pop()+'.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes, status',ST);
