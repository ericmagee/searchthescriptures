// Panel change rev 3 on s252 = rev 2 (luna, grok out; haiku on the panel) plus:
//  operator 13:55 CST 11-17 "try Ernie 5.5 flash, muse ember, minimax 3.1 flash.. place sonnet 5.5 as very last alternate"; 14:08 "excellent ... remove minimax" (minimax failed, execution 38307);
//  operator 14:09 CST 11-17 card: a Claude judge (haiku, sonnet) sits on a Claude debater's debate only if both debaters are Claude.
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'../stk/tpnl2_on252.json'));const N={};w.nodes.forEach(n=>N[n.name]=n);
const rep=(nm,o,n)=>{const s=N[nm].parameters.jsCode;const c=s.split(o).length-1;if(c!==1)throw new Error(nm+' count '+c+' :: '+o.slice(0,70));N[nm].parameters.jsCode=s.replace(o,()=>n);};
const O2="['chatgpt','sol','haiku','hydrogen','gemini','argon','spark','qwen']",O3="['chatgpt','sol','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet','qwen']";
const JF="alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter',luna:'openrouter',haiku:'openrouter',argon:'openrouter',hydrogen:'openrouter',spark:'openrouter'}",JF3=JF.slice(0,-1)+",ernie:'openrouter',ember:'openrouter',sonnet:'openrouter'}";
// Init Seats
rep('Init Seats',"const ORDER0="+O2+"; /* operator 13:16 CST 11-17: luna and grok removed; haiku on the panel */","const ORDER0="+O3+"; /* operator 13:16 CST 11-17: luna and grok removed; haiku on the panel. 13:55: ernie, ember, then sonnet very last (minimax failed and was removed, 14:08) */");
rep('Init Seats',"const __ALT=['hydrogen','gemini','argon','spark']; /* operator 13:16 CST 11-17: haiku to the panel; grok removed */","const __ALT=['hydrogen','gemini','argon','spark','ernie','ember','sonnet']; /* operator 13:16 CST 11-17: haiku to the panel; grok removed. 13:55: ernie, ember, sonnet very last */");
rep('Init Seats',"const FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai',grok:'xai',gemini:'google',hydrogen:'google',argon:'google',spark:'meta'};const dfam=[FAM_PANEL[D.engine],FAM_PANEL[C.engine]].filter(Boolean);",
 "const FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai',grok:'xai',gemini:'google',hydrogen:'google',argon:'google',spark:'meta',ember:'meta',ernie:'baidu',haiku:'anthropic',sonnet:'anthropic',claude:'anthropic',opus:'anthropic'};const dfam=[FAM_PANEL[D.engine],FAM_PANEL[C.engine]].filter(Boolean);const __BOTHC=FAM_PANEL[D.engine]==='anthropic'&&FAM_PANEL[C.engine]==='anthropic'; /* operator 14:09 CST 11-17: a Claude judge sits on a Claude debater's debate only if both debaters are Claude */");
rep('Init Seats',"const pfree0=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));","const pfree0=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0&&!(FAM_PANEL[s]==='anthropic'&&__BOTHC)));");
rep('Init Seats',"const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',"+JF+";","const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',"+JF3+";");
rep('Init Seats',"single_judge:(free.filter(s=>s!=='haiku'&&","single_judge:(free.filter(s=>s!=='haiku'&&s!=='sonnet'&&");
// Resolve Seats
rep('Resolve Seats',"const JFAM={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',"+JF+";","const JFAM={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',"+JF3+";");
rep('Resolve Seats',"S.panel_order.forEach(k=>{if(k!=='haiku'&&debFam.indexOf(famOf(k))>=0)","const __CC=k=>famOf(k)==='anthropic'&&debFam.every(f=>f==='anthropic'); /* operator 14:09 CST 11-17: a Claude judge sits on a Claude debater's debate only if both debaters are Claude (replaces the 11-09 haiku exemption) */\nS.panel_order.forEach(k=>{if(!__CC(k)&&debFam.indexOf(famOf(k))>=0)");
rep('Resolve Seats',"if(S.single_judge&&S.single_judge!=='haiku'&&debFam.indexOf(famOf(S.single_judge))>=0)","if(S.single_judge&&!__CC(S.single_judge)&&debFam.indexOf(famOf(S.single_judge))>=0)");
rep('Resolve Seats',"(reserve0.seat==='haiku'||debFam.indexOf(famOf(reserve0.seat))<0)","(__CC(reserve0.seat)||debFam.indexOf(famOf(reserve0.seat))<0)");
rep('Resolve Seats',".filter(a=>a.seat==='haiku'||debFam.indexOf(a.family)<0);",".filter(a=>(a.family==='anthropic'&&debFam.every(f=>f==='anthropic'))||debFam.indexOf(a.family)<0);");
// Accept Build
rep('Accept Build',"haiku:'haiku',argon:'argon',hydrogen:'hydrogen',spark:'spark'};","haiku:'haiku',argon:'argon',hydrogen:'hydrogen',spark:'spark',ernie:'ernie',ember:'ember',sonnet:'sonnet'};");
rep('Accept Build',"const ORDER="+O2+"; /* operator 13:16 CST 11-17, same list as Init Seats ORDER0 */","const ORDER="+O3+"; /* operator 13:16 and 13:55 CST 11-17, same list as Init Seats ORDER0 */");
// Second Alternate? (round 2 G1) and library G1 (Alternate Build, R2 Alternate Build)
const G1o="(d.family===a.family&&a.api_model!=='anthropic/claude-haiku-5.5')",G1n="(d.family===a.family&&!(a.family==='anthropic'&&deb.every(x=>x.family==='anthropic')))";
rep('Second Alternate?',G1o,G1n);
const u=unpack(w);const L=u.L.slice();const hit=L.map((l,i)=>l.includes(G1o)?i:-1).filter(i=>i>=0);if(hit.length!==1||L[hit[0]].split(G1o).length!==2)throw new Error('library G1 count');
L[hit[0]]=L[hit[0]].replace(G1o,()=>G1n).replace("'G1 (family, 6993; pkgJGR rev 6: haiku exempt, operator 08:34Z 11-09): '","'G1 (family, 6993; operator 14:09 CST 11-17: a Claude judge only when both debaters are Claude): '");
if(!L[hit[0]].includes('operator 14:09 CST 11-17'))throw new Error('G1 reason text');
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
N['Shared Library'].parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[3]||'tpnl3_on252.json',JSON.stringify(w));console.log('library line',hit[0],'MAP n updated',fixed.join(', '));
