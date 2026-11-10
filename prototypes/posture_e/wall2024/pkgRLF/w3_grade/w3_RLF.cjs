process.chdir(__dirname+'/../..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
// W3 grade of pkgRLF (W2, 3f0386cb). node pkgRLF/w3_grade/w3_RLF.cjs > pkgRLF/w3_grade/w3_RLF_out.txt
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s106.json'),CAND=g('pkgRLF/parent_s106_RLF.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null});
let fails=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)fails++;};
const rep=t=>J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const builds={};const build=r=>builds[r]||(builds[r]={F:getF(r),B:run(LIVE,r,'Close Enforcer Build',BO(r,getF(r)))});
// replies: map side -> text; a side with no text answers NONE
const rec=(W,r,by)=>{const {F,B}=build(r);return run(W,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':B,'Close Enforcer Call deepseek':B.map(b=>rep(by[b.json.side]||'CLOSE-CONTRADICTION: NONE'))},'Close Enforcer Call deepseek')[0].json;};
const cnt=t=>String(t).split('\n').filter(l=>/CLOSE-CONTRADICTION/i.test(l)&&!/NONE\b/.test(l)).length;
const sum=R=>JSON.stringify(R.cec.confirmed.map(c=>c.side[0]+' LINK '+c.link+' ['+c.earlier_round+'/'+c.closing_round+']'));
const SC='/mnt/project-files/wall2024/staged_w4/setC_replies_s106/',SA='/mnt/project-files/wall2024/staged_w4/stage_CSS/replies_css_s105/';
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8')).content;
// G1, G2, G3
for(const f of fs.readdirSync(SC).sort()){const m=f.match(/^(\d+)_css_(\w+?)_send(\d)/);const r=m[1],t=rd(SC+f);const L=rec(LIVE,r,{[m[2]]:t}),C=rec(CAND,r,{[m[2]]:t});const rl=/\[round/i.test(t);
 console.log(f+': lines '+cnt(t)+', rows live '+L.cec.rows.length+' cand '+C.cec.rows.length+'; confirmed live '+sum(L)+' cand '+sum(C));
 if(!rl)ok(JSON.stringify(L)===JSON.stringify(C),'G3 '+f+' equals live');
 else{ok(C.cec.rows.length===cnt(t),'G1/G2 '+f+' every line has a row');C.cec.confirmed.forEach(c=>console.log('   BREAK '+c.side+' LINK '+c.link+': EARLIER "'+c.earlier_q.slice(0,80)+'" / CLOSING "'+c.closing_q.slice(0,90)+'"'));
  if(r==='33442')ok(sum(L)==='[]'&&C.cec.confirmed.map(c=>c.link).join()==='2,6','G1 33442 send 2: live none, candidate links 2 and 6');
  if(r==='33705')ok(sum(L)==='[]'&&C.cec.confirmed.map(c=>c.link).join()==='4','G2 33705 send 2: live none, candidate link 4');
  if(r==='33442')fs.writeFileSync('pkgRLF/w3_grade/rows_RLF_w3.json',JSON.stringify(C.cec_log.map(x=>({...x,prompt_sent:x.prompt_sent?'[test]':x.prompt_sent,full_reply:x.full_reply?'[test]':x.full_reply}))));}}
{const D=rd(SA+'34108_css_DEFENDER_reply.json'),Ch=rd(SA+'34108_css_CHALLENGER_reply.json');const L=rec(LIVE,'34108',{DEFENDER:D,CHALLENGER:Ch}),C=rec(CAND,'34108',{DEFENDER:D,CHALLENGER:Ch});ok(JSON.stringify(L)===JSON.stringify(C),'G3 set A 34108 both sides equals live; confirmed '+sum(C));
 // plants on 34108
 const F=build('34108').F;const d6=String(D).split('\n').find(l=>/LINK 6 -- CONFIRMED/.test(l));console.log('   base line: '+d6.slice(0,260));
 const P=(n,t,side,exp)=>{let L2,C2;try{L2=rec(LIVE,'34108',{[side||'DEFENDER']:t});C2=rec(CAND,'34108',{[side||'DEFENDER']:t});}catch(e){ok(false,n+' THROWS '+e.message);return {};}console.log(n+'\n   line: '+t.slice(0,230)+'\n   live '+sum(L2)+' | cand '+sum(C2)+' | cand rows: '+C2.cec.rows.map(x=>x.id+' '+x.status+(x.note?' ('+x.note.slice(0,90)+')':'')).join('; '));ok(exp(C2,L2),n);return C2;};
 const sent2=String(F.cr2).replace(/[*_`]/g,'').split(/\n+|(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.split(' ').length>9&&!String(F.cr3).includes(x)&&!/["“”]/.test(x))[3];
 P('G4 earlier "[round 3]" with a sentence that stands only in round 2',d6.replace(/EARLIER \[CR3\] ".*?" -- CLOSING \[CR4\]/,'EARLIER [round 3] "'+sent2+'" -- CLOSING [round 4]'),0,C=>!C.cec.confirmed.length&&C.cec.rows.length===1&&/NOT CONFIRMED/.test(C.cec.rows[0].status));
 P('G5a closing "[round 9]"',d6.replace('[CR4]','[round 9]'),0,C=>!C.cec.confirmed.length&&C.cec.rows.length===1);
 P('G5b closing "[round 0]"',d6.replace('[CR4]','[round 0]'),0,C=>!C.cec.confirmed.length&&C.cec.rows.length===1);
 P('G5c closing "[round 44]"',d6.replace('[CR4]','[round 44]'),0,C=>!C.cec.confirmed.length&&C.cec.rows.length===1&&C.cec.rows[0].answer==='UNREADABLE');
 P('G5d closing "[CR  4]" two spaces',d6.replace('[CR4]','[CR  4]'),0,C=>!C.cec.confirmed.length&&C.cec.rows.length===1&&C.cec.rows[0].answer==='UNREADABLE');
 const cand=(build('34108').B.flatMap(b=>b.json.cands||[]))[0];console.log('   first candidate of 34108: '+(cand?cand.id+' '+cand.side:'none'));const id=cand?cand.id:'NEW';
 P('G6 NOT A CONTRADICTION with [round N] labels under id '+id,d6.replace(/: \**\s*(NEW\s*\d*|[XJ]\d+)/,': '+id).replace('CONFIRMED','NOT A CONTRADICTION').replace('[CR3]','[round 3]').replace('[CR4]','[round 4]'),cand?cand.side:0,C=>!C.cec.confirmed.length&&C.cec.rows[0]&&C.cec.rows[0].status==='NOT A CONTRADICTION'&&!C.cec.no_answer.includes(id));
 P('G7 [CR3]/[CR4] labels and "round 4" in the reason: same as live',d6+' He said so in round 4.',0,(C,L)=>JSON.stringify(C)===JSON.stringify(L)&&C.cec.confirmed.length===1);
 P('G8 CHALLENGER line with [round n] labels and the defender\'s sentences',d6.replace('DEFENDER','CHALLENGER').replace('[CR3]','[round 3]').replace('[CR4]','[round 4]'),'CHALLENGER',C=>!C.cec.confirmed.length&&C.cec.rows.length===1);
 P('G9 the true D6 pair as "Round 3" / "ROUND 4" without brackets',d6.replace('[CR3]','Round 3').replace('[CR4]','ROUND 4'),0,(C,L)=>!L.cec.confirmed.length&&C.cec.confirmed.length===1&&C.cec.confirmed[0].link===6&&C.cec.confirmed[0].earlier_round==='CR3'&&C.cec.confirmed[0].closing_round==='CR4');}
console.log(fails?'FAILURES: '+fails:'ALL AS LABELED');
