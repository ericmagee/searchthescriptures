// ASK 325 test: run Close Enforcer Record (live vs built) as a whole node on (1) the 35 stored CONFIRMED rows by run, (2) the 10 plants.
const fs=require('fs'),zlib=require('zlib');const W='../gw/prototypes/posture_e/wall2024/a325/';
const src=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Record').parameters.jsCode;
const OLD=src('../a330/live.json'),NEW=src('target_325.json');
const run=(code,F,lines)=>{const links={DEFENDER:[1,2,3,4,5,6,7,8],CHALLENGER:[1,2,3,4,5,6,7,8]};const BA=[{run_token:'T',model:'m',links,cands:[],body:{messages:[{},{content:'p'}]}}];
 const $=n=>n==='Close Enforcer Build'?{all:()=>BA.map(j=>({json:j})),first:()=>({json:BA[0]})}:n==='Final Output'?{first:()=>({json:F})}:{isExecuted:false,first:()=>({json:{}})};
 const $input={all:()=>[{json:{choices:[{message:{content:lines.join('\n')}}]}}]};return new Function('$','$input',code)($,$input)[0].json.cec;};
const rows=JSON.parse(zlib.gunzipSync(fs.readFileSync(W+'w2/rows.json.gz'))),deb=JSON.parse(zlib.gunzipSync(fs.readFileSync(W+'w2/debates.json.gz')));
const Fof=r=>({cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4});
const flips=[];let n=0;
for(const r of rows){const D=deb.find(x=>x.id===r.debate_id);if(!D){console.log('no debate',r.id);continue;}n++;
 const a=run(OLD,Fof(D),[r.response_line]),b=run(NEW,Fof(D),[r.response_line]);const sa=(a.rows[0]||{}).status,sb=(b.rows[0]||{}).status;
 if(sa!==sb)flips.push(r.id+' '+r.run_token.slice(0,10)+': '+sa+' -> '+sb);else if(JSON.stringify(a)!==JSON.stringify(b))flips.push(r.id+' OTHER DIFF');}
console.log('REPLAY rows',n,'changed',flips.length);flips.forEach(f=>console.log('  '+f));
const P=JSON.parse(fs.readFileSync(W+'w4_plants.json'));const byId={};P.cases.forEach(c=>byId[c.id]=c);let pass=0;
for(const c of P.cases){const t=c.same_texts_as?byId[c.same_texts_as]:c;const F={};for(const [s,k] of [['defender','cr'],['challenger','x']])for(const r of [1,2,3,4]){const v=(t[s]||{})['r'+r];if(v!=null)F[s==='defender'?'cr'+r:(r<=2?'gr'+r:'dr'+r)]=v;}
 if(t.synthesis)F.synthesis=t.synthesis;const R=c.row;const sd=R.side;const P0=sd==='DEFENDER'?'CR':'DR';const cr=P0+'4';const cq=(F[(sd==='DEFENDER'?'cr4':'dr4')]||'x y z w v').replace(/[."]/g,'').trim();
 let cq2=cq;const k4=sd==='DEFENDER'?'cr4':'dr4';if(!F[k4])F[k4]=cq;if(R.earlier_round===cr){cq2='the closing words here differ from the earlier ones';F[k4]=F[k4]+'\n'+cq2+'.';}
 const er=/^ROUND/i.test(R.earlier_round)?'[round '+R.earlier_round.replace(/\D/g,'')+']':'['+R.earlier_round+']';
 const line='CLOSE-CONTRADICTION: X1 -- '+sd+' -- LINK 1 -- CONFIRMED -- EARLIER '+er+' "'+R.earlier_q+'" -- CLOSING ['+cr+'] "'+cq2+'" -- plant';
 const a=run(OLD,F,[line]),b=run(NEW,F,[line]);const sa=(a.rows[0]||{}).status,sb=(b.rows[0]||{}).status;
 const got=sb===sa?'KEEP':/other side/.test(sb)?'DEMOTE':'OTHER';const ok=got===c.expect;if(ok)pass++;if(!ok)console.log('   note',JSON.stringify(b.rows[0]&&b.rows[0].note));console.log((ok?'PASS ':'FAIL ')+c.id+' expect '+c.expect+' got '+got+' (live: '+sa+'; built: '+sb+')');}
console.log('PLANTS',pass,'of',P.cases.length);
