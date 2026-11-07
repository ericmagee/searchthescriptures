// pkgECQ (W3 Wall 2859, DeepSeek lane D5). DeepSeek enforcer fix, side-neutral, in the 4 Judge Enforcer nodes (main and Alt).
// 33371 rows 14645-14647 pushed "right: COUNTED (CONCEDED)" on challenger premise 1 quoting as "the challenger's own words" the DEFENDER's [CR2] grant
// "I grant that "till" bounds the abstaining from the taking to the birth"; the (CONCEDED) label exempted them from the pkgEPS hold unchecked.
// Build: the first E-PREM id carries ecq_sides {D: [CR1..CR4], C: [DR1..DR4]} (60000 chars each), once per Build item. Record: a (CONCEDED) push
// passes only when ecqCheck finds its quote is the counted side's own give-up words (ecq_lib.js); otherwise it is HELD (LIVE: "ENFORCER HELD (pkgEPS,
// not sent; ... (CONCEDED) quote not in the side's rounds ...)", which Send Back Build does not send; TRIAL: sent, with a stripped TRIAL mark).
// No ecq_sides (rounds not found): unchanged (exempt as before). Run from wall2024/: node pkgECQ/build_ECQ.cjs [--base dir] [--status TRIAL] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const IN=arg('--base','pkgEAH/patched');const ST=arg('--status','LIVE');const OUT=arg('--out','pkgECQ/'+(ST==='LIVE'?'patched_live':'patched')+'_on_'+IN.replace(/\//g,'_'));
const LIB=fs.readFileSync(__dirname+'/ecq_lib.js','utf8');
const BA="...(k===0?{blk:a?String(a.t).slice(0,8000):''}:{})";
const BB="...(k===0?{blk:a?String(a.t).slice(0,8000):''}:{}),...(k===0&&!__ecqSent?(__ecqSent=1,{ecq_sides:{D:[R&&R.CR1,R&&R.CR2,R&&R.CR3,R&&R.CR4].filter(Boolean).join('\\n').slice(0,60000),C:[R&&R.DR1,R&&R.DR2,R&&R.DR3,R&&R.DR4].filter(Boolean).join('\\n').slice(0,60000)}}):{}) /* pkgECQ */";
const BL="let R=null;";const BL2="let __ecqSent=0; /* pkgECQ: the side rounds ride once */\nlet R=null;";
const RA="if(/^\\s*\\(\\s*CONCEDED\\b/i.test(v.why))return null;";
const RB="if(/^\\s*\\(\\s*CONCEDED\\b/i.test(v.why)){const sd=/against the defender/.test(x.item)?'D':/against the challenger/.test(x.item)?'C':'';if(!sd||!__ecqSides)return null;const q=ecqCheck(v.why,__ecqSides[sd],__ecqSides[sd==='D'?'C':'D']);if(q.ok)return null;"+
 (ST==='LIVE'?"return 'the (CONCEDED) quote is not the counted side own words in its rounds: longest run in its own give-up sentences '+q.own+' words, in the other side rounds '+q.opp+' words';}"
             :"__ecqTrial.set(x,'TRIAL pkgECQ would hold: the CONCEDED quote is not the counted side own words, own run '+q.own+', other side run '+q.opp);return null;}");
const RL="function epsHold(x,v){";
const RL2="/* pkgECQ (W3 2859) */const ECQ_STATUS='"+ST+"';\n"+LIB+"let __ecqSides=null;B.forEach(b=>(b.ids||[]).forEach(x=>{if(!__ecqSides&&x&&x.ecq_sides)__ecqSides=x.ecq_sides;}));const __ecqTrial=new Map();\n"+RL;
const RC="if(!__h)return base;";const RC2="if(!__h)return __ecqTrial.has(x)?base+' ('+__ecqTrial.get(x).replace(/[()]/g,' ')+')':base;";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
fs.mkdirSync(OUT,{recursive:true});const plan={base:IN,status:ST,nodes:[]};
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js','Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){const s0=fs.readFileSync(IN+'/'+f,'utf8');let s;
 if(/Build/.test(f)){s=rep(s0,BL,BL2,f+' flag');s=rep(s,BA,BB,f+' sides');}
 else{s=rep(s0,RL,RL2,f+' lib');s=rep(s,RA,RB,f+' check');if(ST!=='LIVE')s=rep(s,RC,RC2,f+' trial mark');}
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('->',OUT);
