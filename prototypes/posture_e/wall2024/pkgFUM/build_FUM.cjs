// pkgFUM rev 3 (W4, 11-09; W1 FAIL 3581, W3 FAIL 3585: only the asked items' own RESPONSE/STATEMENT lines, by rule and key, and an asked K-RUL card are read from the follow-up). Base live s76 (strip_CJR_KRC).
// pkgFUM (W4, 11-09; W3 grade_34016 countermeasure 4, operator approval 05:15 CST "approved" (Wall 3552); extended to a missing quote, operator "yes" 05:31 CST).
// Before a cure reply is counted, the engine sends ONE follow-up to the same judge, in the same conversation, listing only:
//  (a) the items the reply left with no line at all (cureVerdicts: 'no written response', silent), and
//  (b) the K-W / K-CON / K-S3 items whose RESPONSE is NOT HELD but whose reason does not quote the flagged sentence (still UNCURED).
// The follow-up reply is read first, then the first reply (the reader takes the first RESPONSE line of an item, so a re-asked item reads its new line).
// Wiring per cure path (Panel 1..3, Alternate, R2 Alternate, Cure): <Normalize> -> "FUM Needed? <tag>" (IF $json.fum)
//   true  -> "FUM Call <tag> openrouter" (the path's openrouter call, body $json.fum.body) -> "FUM Merge <tag>" -> <Normalize> (second run: joins the replies, asks nothing)
//   false -> the Normalize node's old targets.
// openrouter only (every judge in the panel today runs through openrouter); other providers ask nothing.
// Library change: the 6 Normalize nodes only (two new functions fumAsk2024, fumJoin2024 and the tail). Base: live s75, library strip_WLG.
// Run from wall2024/: node pkgFUM/build_FUM.cjs [base strip] [out strip] [base fetchback]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_CJR_KRC',OUT=process.argv[3]||'pkgLIB/strip_FUM',FB=process.argv[4]||'/mnt/project-files/wall2024/fetchback_live_s76.json';
const PATHS=[
 {tag:'Panel 1',norm:'Panel Cure Normalize 1',call:'Panel Cure Call 1 openrouter',or:'src&&src.jidx===5'},
 {tag:'Panel 2',norm:'Panel Cure Normalize 2',call:'Panel Cure Call 2 openrouter',or:'src&&src.jidx===5'},
 {tag:'Panel 3',norm:'Panel Cure Normalize 3',call:'Panel Cure Call 3 openrouter',or:'src&&src.jidx===5'},
 {tag:'Alternate',norm:'Alternate Cure Normalize',call:'Alternate Cure Call openrouter',or:'true'},
 {tag:'R2 Alternate',norm:'R2 Alternate Cure Normalize',call:'R2 Alternate Cure Call openrouter',or:'true'},
 {tag:'Cure',norm:'Cure Normalize',call:'Cure Call openrouter',or:'src&&src.jidx===5'}];
const FN=String.raw`/* pkgFUM: the one follow-up. Items the reply left with no line (silent), and K-W/K-CON/K-S3 items answered NOT HELD without the quote; null when none, or not openrouter, or the call failed. */
function fumAsk2024(src,reply,or){try{if(!or||!src||!src.body||!Array.isArray(src.body.messages)||!reply||!reply.ok||!Array.isArray(src.items)||!src.items.length)return null;
 const v=cureVerdicts(src.items,reply,src.broken,src.rounds);const lab=x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':String(x.link==null?'':x.link))+(x.line?': '+String(x.line).replace(/\s+/g,' ').trim():'');
 const miss=v.filter(x=>x.status!=='CURED'&&x.why==='no written response'&&x.silent);
 const noq=v.filter(x=>x.status!=='CURED'&&/^(?:K-W|K-CON|K-S3)$/.test(x.rule)&&x.response&&/^\s*NOT\s+HELD\b/i.test(String(x.response)));
 if(!miss.length&&!noq.length)return null;
 const P=['FOLLOW-UP, asked once. The items below have no line in your reply above that can be counted. Every other item stands as your reply above left it. Answer only the items below, each on its own line beginning RESPONSE:, in the form the request above gives, and write nothing else.'];
 if(miss.length)P.push('','Items your reply left with no RESPONSE line ('+miss.length+'):',...miss.map(x=>'- '+lab(x)),'For each, write: RESPONSE: <the item, as labelled above> | <your answer>. If you hold the item wrong, write: RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>.'+(miss.some(x=>x.rule==='K-RUL')?' For a K-RUL item, write its RESPONSE line and under it the five-line card, one field to a line: RULING, CLAIM, NAMED BY, RULE, APPLIED.':''));
 if(noq.length)P.push('','Items whose NOT HELD reason does not quote the flagged sentence ('+noq.length+'):',...noq.map(x=>'- '+lab(x)),'For each, write its RESPONSE line again: RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>, quoting at least six words in a row of the flagged sentence (all of it when shorter).');
 return {asked:miss.map(x=>'NO LINE '+lab(x)).concat(noq.map(x=>'NO QUOTE '+lab(x))),items:miss.concat(noq).map(x=>({rule:x.rule,side:x.side||null,link:x.link==null?null:x.link})),first:reply,body:Object.assign({},src.body,{messages:src.body.messages.concat([{role:'assistant',content:String(reply.text==null?'':reply.text)},{role:'user',content:P.join('\n')}])})};
}catch(e){return null;}}
/* pkgFUM rev 3 (W1 3581, W3 3585): from the follow-up, only the lines of an asked item are read: its RESPONSE and STATEMENT lines whose label begins with the item's own rule
   and then names its key, and the five-line card under an asked K-RUL item's RESPONSE line. No RETRACTED, RESTATED, PRESSED or SHORT line is read (it would act on every item of its pair).
   Everything else in the follow-up (other items, CORRECTED RESULT/COUNT/STANDING, prose) is dropped, so a follow-up cannot change an item it was not asked about. */
function fumKey2024(x){const N=t=>String(t==null?'':t).toUpperCase().replace(/:/g,' ').replace(/\s+/g,' ').trim();const r=N(x&&x.rule),k=N(x&&x.rule==='K-G3'?(x.side||'')+' STANDING':(x&&x.link));
 return r&&k?new RegExp('^'+r.replace(/[.*+?^$(){}|[\]\\]/g,'\\$&')+' '+k.replace(/[.*+?^$(){}|[\]\\]/g,'\\$&')+'(?![A-Z0-9])'):null;}
function fumKeep2024(text,items){const T=String(text==null?'':text).split('\n');const K=(items||[]).map(x=>({x,re:fumKey2024(x)})).filter(z=>z.re);const out=[];let card=false;
 const N=l=>String(l).replace(/\*\*/g,'').replace(/\u0060/g,'').replace(/^\s*(?:[-*•>]|\d+[.)])?\s*/,'');
 for(const raw of T){const l=N(raw);const U=l.toUpperCase().replace(/\s+/g,' ');
  if(card&&/^(?:RULING|CLAIM|NAMED BY|RULE|APPLIED)\b/.test(U)){out.push(raw);continue;}card=false;
  const m=U.match(/^(RESPONSE|STATEMENT)\s*:\s*([^|]*)\|/);if(!m)continue;const lab=m[2].replace(/:/g,' ').replace(/\s+/g,' ').trim();const z=K.find(z=>z.re.test(lab));if(!z)continue;
  out.push(raw);if(m[1]==='RESPONSE'&&z.x.rule==='K-RUL')card=true;}
 return out.join('\n');}
/* pkgFUM: the kept follow-up lines are read first, then the first reply; a failed follow-up leaves the first reply as it was. */
function fumJoin2024(r1,r2,items){if(!r1||!r1.ok)return r1||r2||{ok:false,text:null,why:'no reply'};if(!r2||!r2.ok)return Object.assign({},r1,{fum:{ok:false,why:r2?String(r2.why||'no reply'):'no reply'}});
 const k=fumKeep2024(String(cureUnwrap(r2.text)),items);return Object.assign({},r1,{text:(k?k+'\n\n':'')+String(cureUnwrap(r1.text)),fum:{ok:true,finish:r2.finish||null,kept:k?k.split('\n').length:0}});}
`;
const T0=' const reply=(it.json&&it.json.cure&&it.json.cure.skip)?{ok:false,text:null,why:it.json.cure.skip}:cureText(it.json);\n return {json:{cure:';
const T1=(or)=>' const __fd=!!(it.json&&it.json.fum_done);const reply=__fd?fumJoin2024(it.json.fum_first,cureText(it.json.fum_call||{}),it.json.fum_items):(it.json&&it.json.cure&&it.json.cure.skip)?{ok:false,text:null,why:it.json.cure.skip}:cureText(it.json);const __fum=__fd?null:fumAsk2024(src,reply,'+or+'); /* pkgFUM */\n return {json:{...(__fum?{fum:__fum}:{}),cure:';
const sub=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+' hits for '+a.slice(0,60));return s.split(a).join(b);};
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,library:{},nodes_added:[],connections:{}};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/patched/'+f,'utf8');let s=s0;
 const p=PATHS.find(p=>p.norm.replace(/ /g,'_')+'.js'===f);
 if(p){s=sub(s,'\nreturn $input.all().map((it,i)=>{let src=null;','\n'+FN+'return $input.all().map((it,i)=>{let src=null;',f);s=sub(s,T0,T1(p.or),f);new Function('$','$input','return (async()=>{\n'+s+'\n})();');}
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s)};}
// nodes and connections
const W=JSON.parse(fs.readFileSync(FB,'utf8'));const N=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('no node '+n);return x;};const C=W.connections;
const uuid=s=>{const x=cr.createHash('sha256').update('pkgFUM '+s).digest('hex');return x.slice(0,8)+'-'+x.slice(8,12)+'-4'+x.slice(13,16)+'-a'+x.slice(17,20)+'-'+x.slice(20,32);};
const add=[],conn={};
for(const p of PATHS){const nm=N(p.norm),call=N(p.call);const [x,y]=nm.position;
 const ifn={id:uuid('if '+p.tag),name:'FUM Needed? '+p.tag,type:'n8n-nodes-base.if',typeVersion:2.2,position:[x+100,y+160],parameters:{conditions:{combinator:'and',conditions:[{id:'fum-needed-'+p.tag.toLowerCase().replace(/ /g,'-'),leftValue:'={{ !!$json.fum }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}};
 const jb=call.parameters.jsonBody;if(jb.split('$json.cure.body').length!==2)throw new Error(p.call+': jsonBody does not name $json.cure.body once');
 const cl={...JSON.parse(JSON.stringify(call)),id:uuid('call '+p.tag),name:'FUM Call '+p.tag+' openrouter',position:[x+300,y+160]};cl.parameters.jsonBody=jb.replace('$json.cure.body','$json.fum.body');
 const mg={id:uuid('merge '+p.tag),name:'FUM Merge '+p.tag,type:'n8n-nodes-base.code',typeVersion:2,position:[x+500,y+160],parameters:{jsCode:
  "// pkgFUM: carries the follow-up reply and the first reply back to \""+p.norm+"\", which joins them and asks nothing more (fum_done).\n"+
  "return $input.all().map((it,i)=>{let p=null;try{p=$('FUM Needed? "+p.tag+"').itemMatching(i).json;}catch(e){p=null;}if(!p){try{p=$('FUM Needed? "+p.tag+"').all()[i].json;}catch(e){p=null;}}\n"+
  " return {json:{fum_done:true,fum_asked:p&&p.fum?p.fum.asked:[],fum_items:p&&p.fum?p.fum.items:[],fum_first:p&&p.fum?p.fum.first:null,fum_call:it.json},pairedItem:{item:i}};});"}};
 add.push(ifn,cl,mg);
 conn[p.norm]={main:[[{node:ifn.name,type:'main',index:0}]]};
 conn[ifn.name]={main:[[{node:cl.name,type:'main',index:0}],JSON.parse(JSON.stringify(C[p.norm].main[0]))]};
 conn[cl.name]={main:[[{node:mg.name,type:'main',index:0}]]};
 conn[mg.name]={main:[[{node:p.norm,type:'main',index:0}]]};}
plan.nodes_added=add;plan.connections=conn;plan.fetchback=FB;plan.fetchback_version=W.versionId;
fs.writeFileSync('pkgFUM/plan_FUM.json',JSON.stringify(plan,null,1)+'\n');console.log('library',Object.keys(plan.library).length,'changed',Object.values(plan.library).filter(x=>x.base!==x.patched).length,'nodes added',add.length);
