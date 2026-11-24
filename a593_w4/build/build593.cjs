// ASK 593 (W4): Haiku out of the debate engine in full (operator 01:15 and 01:16 CST 11-24, ruling rows 518, 519).
// usage: node build593.cjs <engine in> <child in> <engine out> <child out>. Each edit's anchor must occur as counted, or the build stops.
const fs=require('fs');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');
const [ei,ci,eo,co]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(ei,'utf8')),C=JSON.parse(fs.readFileSync(ci,'utf8'));
const rep=(s,a,b,n,what)=>{const k=s.split(a).length-1;if(k!==n)throw new Error(what+': anchor occurs '+k+' times, expected '+n);return s.split(a).join(b);};
const ED={
 'Init Seats':[["const ORDER0=['chatgpt','sol','sol62','haiku','gemini',","const ORDER0=['chatgpt','sol','sol62','gemini',",1,'judge order'],
  ["const __ALT=['haiku','gemini',","const __ALT=['gemini',",1,'alternates'],
  ["haiku:{fam:'openrouter',mc:'haiku'},","",1,'debater key (ENG)'],
  ["haiku:'anthropic',","",1,'family map (FAM_PANEL)'],
  ["haiku:'openrouter',","",1,'call family map'],
  ["pfree.push(...pfree.splice(3).sort((x,y)=>(x==='haiku')-(y==='haiku')));","",1,'the haiku-last rule'],
  ["s!=='haiku'&&s!=='sonnet'","s!=='sonnet'",1,'the single judge filter']],
 'Accept Build':[["haiku:'haiku',","",1,'ENG_SEAT'],["const ORDER=['chatgpt','sol','sol62','haiku','gemini',","const ORDER=['chatgpt','sol','sol62','gemini',",1,'agreement order']],
 'Resolve Seats':[["haiku:'openrouter',","",1,'call family map'],["opus|sonnet|haiku|fable|mythos","opus|sonnet|fable|mythos",2,'direct Anthropic id form']],
 'Build Synthesis':[["haiku:'openrouter',","",1,'call family map']],
 'Build Independent Verdict':[["haiku:'openrouter',","",1,'call family map']],
 'Build Diagnostic Prompt':[["haiku:'openrouter',","",1,'call family map']],
 'Format Markdown':[["haiku:'Claude Haiku',","",1,'display name']],
 'Failure Salvage':[["haiku:'Claude Haiku',","",1,'display name']],
};
for(const n of ['D1','C1','D2','C2','D3','C3','D4','C4'])ED[n+' Build']=[["opus|sonnet|haiku|fable|mythos","opus|sonnet|fable|mythos",1,'direct Anthropic id form']];
const log=[];for(const [n,eds] of Object.entries(ED)){const x=E.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);let s=x.parameters.jsCode;const b=lp.md5(s).slice(0,8);for(const [a,r,k,w] of eds)s=rep(s,a,r,k,n+' '+w);x.parameters.jsCode=s;log.push(n+' '+b+'->'+lp.md5(s).slice(0,8));}
const LE=[{line:null,a:',"anthropic/claude-haiku-5.5"]',b:']',what:'xkJsonModels (cure note list)'}];
const le=lp.apply(E,JSON.parse(JSON.stringify(LE))),lc=lp.apply(C,JSON.parse(JSON.stringify(LE)));
const left=W=>W.nodes.filter(n=>/haiku/i.test(JSON.stringify(n.parameters))).map(n=>n.name);
const L1=left(E),L2=left(C);if(L1.length||L2.length)throw new Error('haiku remains in '+L1.concat(L2).join(', '));
fs.writeFileSync(eo,JSON.stringify(E));fs.writeFileSync(co,JSON.stringify(C));
console.log(JSON.stringify({nodes:log,lib_engine:le,lib_child:lc,eng_md5:lp.md5(JSON.stringify(E)).slice(0,8),child_md5:lp.md5(JSON.stringify(C)).slice(0,8)},null,1));
