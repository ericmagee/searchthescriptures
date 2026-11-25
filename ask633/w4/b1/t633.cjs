// ASK 633 tests (W4). Usage: node t633.cjs base_eng.json target_engine.json fx/r42517_bars.json
const fs=require('fs');const [,,BE,TE,FX]=process.argv;const B=JSON.parse(fs.readFileSync(BE,'utf8')),T=JSON.parse(fs.readFileSync(TE,'utf8')),F=JSON.parse(fs.readFileSync(FX,'utf8'));
let P=0,Fl=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);c?P++:Fl++;};
const N=E=>Object.fromEntries(E.nodes.map(n=>[n.name,n]));const NB=N(B),NT=N(T);
ok(Object.keys(NB).length===Object.keys(NT).length&&Object.keys(NB).every(k=>k in NT),'same '+Object.keys(NB).length+' node names');
const ch=Object.keys(NB).filter(k=>JSON.stringify(NB[k])!==JSON.stringify(NT[k]));ok(ch.length===1&&ch[0]==='Build Save Body','only Build Save Body changed: '+ch.join(','));
ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'connections equal');
const loop=E=>{const c=N(E)['Build Save Body'].parameters.jsCode;const i=c.indexOf('for(const b of __BARB){');const j=c.indexOf('\nfor(const nd of',i);return c.slice(i,j);};
const LB=loop(B),LT=loop(T);ok(LB.length>0&&LT.length>0,'loop found in base and target');
const run=(L,bars,d4b)=>{const FF=[];const $=n=>{if(n!=='D4B Build')throw new Error('unexpected node '+n);if(!d4b)return {isExecuted:false,first:()=>{throw new Error('not run');}};return {isExecuted:true,first:()=>({json:d4b})};};new Function('FF','__BARB','$',L)(FF,bars,$);return FF;};
const rc=a=>a.filter(s=>/RE-CALL/.test(s));
const strip=s=>s.replace(/^\[AUDIT v47: (?:BARRED MOVE|ROUND) RE-CALL \((?:pkgBAR|pkgBAR, pkgLAYB)\)/,'').replace(/SENT BACK: [^;]*?(?:; KEPT)/,'SENT BACK: X; KEPT').replace(/SENT BACK: .*?; KEPT/,'SENT BACK: X; KEPT');
// C1
const bars=['C1B Extract','D2B Extract','C2B Extract','D3B Extract','C3B Extract','D4B Extract','C4B Extract'].map(k=>F[k].bar);
ok(bars.every(b=>b&&'layers' in b&&'first' in b.layers),'N1: layers.first is present in the stored bar of all seven 42517 Extracts');
const o0=run(LB,bars,F['D4B Build']),o1=run(LT,bars,F['D4B Build']);
console.log('  base:  '+rc(o0).join('\n         '));console.log('  target:'+rc(o1).join('\n         '));
ok(rc(o1).length===2&&rc(o0).length===2,'C1: two re-call lines (DR1, DR2), as before');
ok(rc(o1).some(s=>s.includes('ROUND: [DR1]; SENT BACK: 0 barred sentence(s); 4 layer point(s); KEPT:')),'C1: DR1 reads 0 barred sentence(s); 4 layer point(s)');
ok(rc(o1).some(s=>s.includes('ROUND: [DR2]; SENT BACK: 1 barred sentence(s); 1 layer point(s); KEPT:')),'C1: DR2 reads 1 barred sentence(s); 1 layer point(s)');
ok(rc(o1).every(s=>!/SENT BACK: \d+ sentence\(s\)/.test(s)),'C1: no line reads "SENT BACK: <n> sentence(s)"');
ok(JSON.stringify(o0.map(strip))===JSON.stringify(o1.map(strip)),'C1: every line equal outside the label and SENT BACK (VOID lines included)');
// C2 synthetic
const mk=(round,h,l,o)=>({applies:true,resent:true,seat:'x/y',side:'DEFENDER',round,first:{hits:Array(h).fill({})},kept:'second',why:'w',void:[],...(l===undefined?{}:{layers:{first:{items:Array(l).fill({})}}}),...(o||{})});
const one=(b,d4b)=>rc(run(LT,[b],d4b))[0]||'';const oneB=(b,d4b)=>rc(run(LB,[b],d4b))[0]||'';
const cases=[['barred only',mk('DR2',2,0),null,'2 barred sentence(s); 0 layer point(s); KEPT'],['layers only',mk('DR3',0,5),null,'0 barred sentence(s); 5 layer point(s); KEPT'],['both',mk('CR2',3,2),null,'3 barred sentence(s); 2 layer point(s); KEPT'],
 ['CR4 pressed',mk('CR4',0,0),{press_open:[1,2,3]},'0 barred sentence(s); 0 layer point(s); 3 pressed verse(s) with no ANSWER line; KEPT'],['CR4, D4B Build not run',mk('CR4',1,6),null,'1 barred sentence(s); 6 layer point(s); 0 pressed verse(s) with no ANSWER line; KEPT'],
 ['no layers field',mk('DR1',1,undefined),null,'1 barred sentence(s); 0 layer point(s); KEPT'],['layers.first null',mk('DR1',0,undefined,{layers:{first:null}}),null,'0 barred sentence(s); 0 layer point(s); KEPT']];
for(const [nm,b,d,want] of cases){const s=one(b,d);ok(s.includes('SENT BACK: '+want)&&strip(s)===strip(oneB(b,d)),'C2 '+nm+': '+want.replace('; KEPT',''));}
ok(one(mk('DR1',1,1,{resent:false}))===''&&oneB(mk('DR1',1,1,{resent:false}))==='','C2 not resent: no line, as before');
// C4 ASK 599
const tc=NT['Build Save Body'].parameters.jsCode,bc=NB['Build Save Body'].parameters.jsCode;
const nl=tc.split('\n'),bl=bc.split('\n');const dl=nl.map((l,i)=>l!==bl[i]?i:-1).filter(i=>i>=0);
ok(nl.length===bl.length&&dl.length===1,'one line changed (line '+(dl[0]+1)+')');
ok((nl[dl[0]].match(/ASK 633/g)||[]).length>=1&&(nl[dl[0]].match(/catch\(e\)/g)||[]).length-(bl[dl[0]].match(/catch\(e\)/g)||[]).length===1,'C4: tagged ASK 633; one new catch, the isExecuted guard form');
try{new Function('$','$input','$json',tc);ok(true,'target Build Save Body parses');}catch(e){ok(false,'target parses: '+e.message);}
console.log('RESULT: '+(Fl?'FAIL ('+Fl+')':'ALL PASS ('+P+')'));
