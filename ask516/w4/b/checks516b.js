// ASK 516b build checks (W4): node diff vs live, 12 fill expressions identical but the Build name, md5 against hashlib, C3 marker with prompt_tokens.
const fs=require('fs');const cp=require('child_process');const D=__dirname;const S=JSON.stringify;const out=[];const ok=(n,c,i)=>{out.push((c?'PASS ':'FAIL ')+n+(i?' '+i:''));};
for(const [a,b] of [['live_moMxiV4Irg1uRBZN.json','target_engine_516b.json'],['live_MqQHRl7mQQ0z8QdT.json','target_child_516b.json']]){
 const A=JSON.parse(fs.readFileSync(D+'/'+a)),B=JSON.parse(fs.readFileSync(D+'/'+b));const NA={},NB={};A.nodes.forEach(x=>NA[x.name]=x);B.nodes.forEach(x=>NB[x.name]=x);
 const ch=Object.keys(NA).filter(k=>S(NA[k])!==S(NB[k]));const par=Object.keys(NA).filter(k=>S(NA[k].parameters)!==S(NB[k]&&NB[k].parameters));
 ok(b+': same node set and connections',Object.keys(NA).length===Object.keys(NB).length&&Object.keys(NA).every(k=>k in NB)&&S(A.connections)===S(B.connections),Object.keys(NB).length+' nodes');
 ok(b+': only parameters change',S(ch)===S(par),ch.length+' nodes changed: '+ch.join(', '));}
const E=JSON.parse(fs.readFileSync(D+'/target_engine_516b.json')),C=JSON.parse(fs.readFileSync(D+'/target_child_516b.json'));
const ex=[...E.nodes,...C.nodes].filter(x=>x.type.endsWith('httpRequest')&&/THE ROUNDS IN FULL/.test(x.parameters.jsonBody||''));
const norm=x=>x.parameters.jsonBody.replace(/\$\('[^']+'\)\.first\(\)\.json\.rounds516/,"$('<BUILD>').first().json.rounds516");
ok('12 fill expressions',ex.length===12,ex.length+'');ok('the 12 are one text except the Build name',new Set(ex.map(norm)).size===1);
const L=JSON.parse(fs.readFileSync(D+'/lib516b.json'));const L0=(()=>{const t=JSON.parse(fs.readFileSync(D+'/live_moMxiV4Irg1uRBZN.json')).nodes.find(x=>x.name==='Shared Library').parameters.jsCode;return JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));})();
ok('library: 3560 lines, only 3191, 3246, 3405 change',L.length===3560&&S(L.map((x,i)=>x!==L0[i]?i:-1).filter(i=>i>=0))===S([3191,3246,3405]));
// md5 in line 3191 vs hashlib on 41117's rounds
const R=JSON.parse(fs.readFileSync(D+'/replay_r0.json','utf8'));const m=L[3191].match(/const M5=s=>\{[\s\S]*?return h;\};/);const M5=new Function(m[0]+';return M5;')();
fs.writeFileSync(D+'/rounds_41117.txt',R);const py=cp.execSync("python3 -c \"import hashlib,sys;print(hashlib.md5(open(sys.argv[1],encoding='utf-8').read().encode('utf-8')).hexdigest())\" "+D+'/rounds_41117.txt').toString().trim();
ok('line 3191 md5 = Python hashlib on 41117 rounds',M5(R)===py,py);
// C3: line 3405 marker with prompt_tokens; no rounds copy in prompt_sent
const seg=L[3405].match(/prompt_sent:k===0\?([\s\S]*?):null,full_reply/)[1];const ph='[THE ROUNDS IN FULL: 149469 characters, md5 '+py.slice(0,8)+'; the same in every call of this run]\n\n';
const b={body:{messages:[{},{content:'RULES\n\n'+ph+'ITEM X1 (...)'}]}};const f=new Function('b','R','ci','k','return '+seg+';');
const v1=f(b,[{usage:{prompt_tokens:61234}}],0,0),v2=f(b,[{error:{}}],0,0);
ok('3405: marker gains prompt_tokens',v1.includes('the same in every call of this run; prompt_tokens 61234]')&&!v1.includes(R.slice(0,200)),v1.slice(0,140).replace(/\n/g,'\\n'));ok('3405: no usage -> marker unchanged',v2===b.body.messages[1].content);
for(const x of out)console.log(x);
// Reread Record (actual code, engine and child): marker gains prompt_tokens; rounds not in prompt_sent
(async()=>{for(const [W,n,bn] of [[E,'Reread Record','Reread Build'],[E,'Alt Reread Record','Alt Reread Build'],[C,'R2 Alt Reread Record','R2 Alt Reread Build']]){
 const js=W.nodes.find(x=>x.name===n).parameters.jsCode;const item={json:{rr_skip:false,run_token:'t',not_checked:[],ids:[{id:'H1.1',seat:'sol',sid:'S1',rule:'E-COL',item:'X',to:'new line',reason:'(right: x)'}],body:{messages:[{content:'s'},{content:'RULES\n\n'+ph+'SECOND READING ...'}]}}};
 const $=k=>({isExecuted:true,all:()=>k===bn?[item]:[],first:()=>k===bn?item:{json:{}},params:{}});const $input={all:()=>[{json:{choices:[{message:{content:'ENFORCER: H1.1 -- AGREE -- RIGHT: STANDS -- ok'}}],usage:{prompt_tokens:777}}}]};
 const r=await new Function('$','$input','return (async()=>{\n'+js+'\n})();')($,$input);const p=r[0].json.rr_rows[0].prompt_sent;
 console.log((p.includes('this run; prompt_tokens 777]')?'PASS ':'FAIL ')+n+': marker gains prompt_tokens');}})();
