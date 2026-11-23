// ASK 516b (W4 build of W3 plan516b rev 6): lower-memory 516. Library lines 3191, 3246, 3405; MAP override of Judge Enforcer Build;
// inline nodes: Judge Enforcer Resume, Reread Record, Alt Reread Record, R2 Alt Reread Record; 12 sender jsonBody expressions.
const fs=require('fs');const crypto=require('crypto');const sha=x=>crypto.createHash('sha256').update(x).digest('hex').slice(0,16);
const [EIN,CIN,EOUT,COUT]=process.argv.slice(2);const D=__dirname;const log=[];
const once=(s,a,b,tag)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(tag+' anchor count '+n);return s.replace(a,()=>b);};
const PH_HEAD="'[THE ROUNDS IN FULL: '";
// library edits
const REC=fs.readFileSync(D+'/rec516b.js','utf8').replace(/\s+$/,'')+' ';
const SPREAD="...(ci===0&&typeof __REC515!=='undefined'&&__REC515&&__REC515.held&&__REC515.held()?{rounds516:__REC515.held()}:{}),";
const TOK=(txt,rep)=>"((t,u)=>u==null?t:t.replace(/(\\[THE ROUNDS IN FULL: \\d+ characters, md5 [0-9a-f]{8}; the same in every call of this run)\\]/,(a,h)=>h+'; prompt_tokens '+u+']'))("+txt+",(()=>{try{const p="+rep+".usage.prompt_tokens;return p==null?null:p;}catch(e){return null;}})())";
function patchLib(L){L=L.slice();
 {const i=3191,k=L[i].indexOf("const SYS='You are the enforcer");if(k<0||!L[i].startsWith('/* pkgREC (ASK 515'))throw new Error('3191 base');const before=L[i];L[i]=REC+L[i].slice(k);log.push('lib L3191 pkgREC '+(L[i].length-before.length>=0?'+':'')+(L[i].length-before.length)+' chars');}
 {const i=3246,a="({json:{je_skip:false,code_rows:ci===0?code_rows:[],";L[i]=once(L[i],a,"({json:{je_skip:false,"+SPREAD+"code_rows:ci===0?code_rows:[],",'3246');log.push('lib L3246 rounds516 on item 0 (Alt and R2 Alt builds)');}
 {const i=3405,a="prompt_sent:k===0?b.body.messages[1].content:null,";L[i]=once(L[i],a,"prompt_sent:k===0?"+TOK("b.body.messages[1].content","R[ci]")+":null,",'3405');log.push('lib L3405 prompt_tokens on the marker');}
 return L;}
const PATCHED_MAP_A="return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,code_rows:ci===0?code_rows:[],";
const PATCHED_MAP_B="return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,"+SPREAD+"code_rows:ci===0?code_rows:[],";
const FILL=node=>"={{ (b=>{const RX=/\\[THE ROUNDS IN FULL: (\\d+) characters, md5 ([0-9a-f]{8}); the same in every call of this run\\]\\n\\n/;const u=b&&Array.isArray(b.messages)&&b.messages[1]&&typeof b.messages[1].content==='string'?b.messages[1].content:'';const m=u.match(RX);if(!m)return b;let r=null;try{r=$('"+node+"').first().json.rounds516;}catch(e){r=null;}if(typeof r!=='string'||r.length!==Number(m[1]))throw new Error('pkgREC 516b: THE ROUNDS IN FULL could not be put in the call (held '+(typeof r==='string'?r.length:'none')+' characters; the placeholder says '+m[1]+')');return Object.assign({},b,{messages:b.messages.map((x,i)=>i===1?Object.assign({},x,{content:u.replace(RX,()=>r)}):x)});})($json.body) }}";
const SENDERS={engine:{'Enforcer Group Batch Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Call openrouter':'Alt Judge Enforcer Build','Judge Enforcer Retry Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Retry Call openrouter':'Alt Judge Enforcer Build','Judge Enforcer Resend Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Resend Call openrouter':'Alt Judge Enforcer Build','Reread Call openrouter':'Judge Enforcer Build','Alt Reread Call openrouter':'Alt Judge Enforcer Build'},
 child:{'R2 Alt Judge Enforcer Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Retry Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Resend Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Reread Call openrouter':'R2 Alt Judge Enforcer Build'}};
for(const k of Object.keys(SENDERS))for(const [s,n] of Object.entries(SENDERS[k])){const e=FILL(n);const inner=e.slice(3,-2);if(inner.includes('{{')||inner.includes('}}'))throw new Error('braces in fill for '+s);}
const RESUME_OLD="return $('Judge Enforcer Build').all();";
const RESUME_NEW="return $('Judge Enforcer Build').all().map(x=>{if(!x||!x.json||!Object.prototype.hasOwnProperty.call(x.json,'rounds516'))return x;const j=Object.assign({},x.json);delete j.rounds516;return Object.assign({},x,{json:j});}); /* ASK 516b: the rounds are held once, on Judge Enforcer Build */";
const RR_OLD="prompt_sent:k===0?String(b.body&&b.body.messages&&b.body.messages[1]&&b.body.messages[1].content||''):null,";
const RR_NEW="prompt_sent:k===0?"+TOK("String(b.body&&b.body.messages&&b.body.messages[1]&&b.body.messages[1].content||'')","R[i]")+":null,";
const INLINE={engine:{'Judge Enforcer Resume':[RESUME_OLD,RESUME_NEW],'Reread Record':[RR_OLD,RR_NEW],'Alt Reread Record':[RR_OLD,RR_NEW]},child:{'R2 Alt Reread Record':[RR_OLD,RR_NEW]}};
function patchWF(FIN,FOUT,Lnew,which){
 const e=JSON.parse(fs.readFileSync(FIN,'utf8'));const out={name:e.name,nodes:e.nodes,connections:e.connections,settings:e.settings};
 const n=e.nodes.find(x=>x.name==='Shared Library');const t=n.parameters.jsCode;
 const a=t.indexOf('\n/*LIB*/')+8,b=t.lastIndexOf('\n/*MAP*/'),c=b+8,d=t.lastIndexOf('\n/*END*/');
 const L=JSON.parse(t.slice(a,b)),M=JSON.parse(t.slice(c,d));const L0=JSON.stringify(L);
 if(L.length!==Lnew.length)throw new Error('line count differs');
 // MAP override for Judge Enforcer Build
 let hit=0;M['Judge Enforcer Build'].p=M['Judge Enforcer Build'].p.map(x=>{if(Array.isArray(x)&&typeof x[0]==='string'&&x[0].startsWith(PATCHED_MAP_A)){hit++;return [PATCHED_MAP_B+x[0].slice(PATCHED_MAP_A.length)];}return x;});if(hit!==1)throw new Error('MAP JEB override '+hit);
 for(const k in M)if(k!=='Judge Enforcer Build')for(const x of M[k].p)if(Array.isArray(x)&&typeof x[0]==='string'&&x[0].includes(PATCHED_MAP_A))throw new Error('other override holds the JEB return: '+k);
 const rebuild=(k,LL)=>M[k].p.map(x=>typeof x==='number'?LL[x]:typeof x[0]==='string'?x[0]:LL.slice(x[0],x[1]+1).join('\n')).join('\n');
 const ch=[];for(const k in M){const code=rebuild(k,Lnew);if(code.length!==M[k].n){ch.push(k);M[k].n=code.length;}}
 const LJ=JSON.stringify(Lnew);let hk=0;const head=t.slice(0,a).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m0,k)=>{hk++;if(+k!==L.length)throw new Error('header line count');return '// library sha '+sha(LJ)+', '+Lnew.length+' lines';});if(hk!==1)throw new Error('header');
 n.parameters.jsCode=head+LJ+t.slice(b,c)+JSON.stringify(M)+t.slice(d);
 let bad=0;for(const k in M){try{new Function('$','$input','return (async()=>{\n'+rebuild(k,Lnew)+'\n})();');}catch(err){bad++;console.log('SYNTAX',k,err.message);}}if(bad)throw new Error('syntax');
 const touched=['Shared Library'];
 for(const [nm,[o,w]] of Object.entries(INLINE[which])){const x=e.nodes.find(y=>y.name===nm);if(!x)throw new Error('no node '+nm);x.parameters.jsCode=once(x.parameters.jsCode,o,w,nm);try{new Function('$','$input','return (async()=>{\n'+x.parameters.jsCode+'\n})();');}catch(err){throw new Error('syntax '+nm+' '+err.message);}touched.push(nm);}
 for(const [nm,src] of Object.entries(SENDERS[which])){const x=e.nodes.find(y=>y.name===nm);if(!x)throw new Error('no node '+nm);if(x.parameters.jsonBody!=='={{ $json.body }}')throw new Error('sender base '+nm);x.parameters.jsonBody=FILL(src);touched.push(nm);}
 console.log(e.name,'| library sha',sha(L0),'->',sha(LJ),'| MAP n updated:',ch.length,ch.join(', '),'| syntax ok',Object.keys(M).length,'| nodes touched',touched.length+':',touched.join(', '));
 fs.writeFileSync(FOUT,JSON.stringify(out,null,1));}
const e0=JSON.parse(fs.readFileSync(EIN,'utf8'));const t0=e0.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
const Lnew=patchLib(JSON.parse(t0.slice(t0.indexOf('\n/*LIB*/')+8,t0.lastIndexOf('\n/*MAP*/'))));
patchWF(EIN,EOUT,Lnew,'engine');patchWF(CIN,COUT,Lnew,'child');
fs.writeFileSync(D+'/lib516b.json',JSON.stringify(Lnew));console.log(log.join('\n'));
