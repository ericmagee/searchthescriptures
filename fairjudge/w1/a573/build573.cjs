// ASK 573 offline build (W1 planning evidence; W4 rebuilds on a fresh live readback before any write).
// Adds MAP entry "__RL" pointing at the LIB lines that already hold the __RL text (no LIB line added, LIB sha unchanged), replaces each node's __RL statement with a pkgREFP-shape loader, resets the sha header.
const fs=require('fs'),cr=require('crypto');const SP='/tmp/claude-0/-home-claude/25c53118-408e-5b9f-a314-6593b8f02ba2/scratchpad/';
const eng=JSON.parse(fs.readFileSync(SP+'a572/eng.json')),ch=JSON.parse(fs.readFileSync(SP+'a572/child.json'));
const d=JSON.parse(fs.readFileSync('/root/.claude/projects/-home-claude/25c53118-408e-5b9f-a314-6593b8f02ba2/tool-results/mcp-n8n-get_workflow_versions_diff-1795478515387-33fhgi.txt'));
eng.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode=d.nodesModified[0].changes.parameters.jsCode.__new;
fs.writeFileSync('base_engine_d8292f62.json',JSON.stringify(eng));fs.writeFileSync('base_child_de9efc4e.json',JSON.stringify(ch));
const RL=fs.readFileSync('rl_text.js','utf8');
const LOADER="const __RL=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/'))).__RL;if(!M)throw new Error('ASK 573: the Shared Library holds no __RL entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('ASK 573: rebuilt __RL is '+S.length+', expected '+M.n);return new Function(S+'\\nreturn __RL;')();})($('Shared Library').params.jsCode);";
const patchLib=w=>{const n=w.nodes.find(x=>x.name==='Shared Library');const c=n.parameters.jsCode;const a=c.indexOf('\n/*LIB*/'),b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
 const L=JSON.parse(c.slice(a+8,b));const M=JSON.parse(c.slice(b+8,e));if(M.__RL)throw new Error('__RL exists');const add=RL.split('\n');const s0=L.indexOf(add[0]);if(s0<0||!add.every((x,k)=>L[s0+k]===x)||L.indexOf(add[0],s0+1)>=0)throw new Error('the __RL lines are not once and contiguous in LIB');M.__RL={n:RL.length,p:[[s0,s0+add.length-1]]}; /* reuse: LIB already holds the __RL text (served to 47 modules); no LIB line is added */
 const sha=cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
 let head=c.slice(0,a).replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
 n.parameters.jsCode=head+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);return {sha,lines:L.length,start:s0,end:L.length-1,addLines:add.length}};
const patchNodes=w=>{const done=[];for(const n of w.nodes){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library')continue;const k=s.split(RL).length-1;if(!k)continue;if(k!==1)throw new Error(n.name+' has '+k+' copies');n.parameters.jsCode=s.replace(RL,()=>LOADER);done.push(n.name+' '+s.length+'->'+n.parameters.jsCode.length)}return done};
const te=JSON.parse(JSON.stringify(eng)),tc=JSON.parse(JSON.stringify(ch));
const le=patchLib(te),lc=patchLib(tc);const ne=patchNodes(te),nc=patchNodes(tc);
fs.writeFileSync('target_engine_573.json',JSON.stringify(te));fs.writeFileSync('target_child_573.json',JSON.stringify(tc));
console.log('loader len',LOADER.length,'| engine lib',JSON.stringify(le),'| child lib',JSON.stringify(lc));console.log('engine nodes:',ne.join('; '));console.log('child nodes:',nc.join('; '));
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);console.log('engine code',code(eng),'->',code(te),'delta',code(te)-code(eng),'| child code',code(ch),'->',code(tc),'delta',code(tc)-code(ch));
