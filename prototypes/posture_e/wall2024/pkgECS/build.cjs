// pkgECS (W2): the DeepSeek E-COL check is not asked about a LINK BROKEN collision line on a link the engine broke by a CONFIRMED closing contradiction
// (Close Enforcer Record or Judge Contradiction Record). Such a line is recorded by code as NOT ASKED, as the send-back already does not send it (pkgECB).
// Built on live s140 through the pkgLIB form-3 map (pattern of pkgCMX/build.cjs). usage: node pkgECS/build.cjs <base fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const [,,inF,outF]=process.argv;let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const W0=JSON.parse(JSON.stringify(W));const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o.slice(0,80));return s.replace(o,()=>n);};
const has=(v,i)=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1]));
const uses=i=>Object.entries(M).filter(([n,v])=>has(v,i));
const edLib=(o,nw)=>{const i=one(o);const s=L[i];L[i]=rep(s,o,nw);const d=L[i].length-s.length;for(const [n,v] of uses(i))v.n+=d;console.log('lib line',i,'+'+d,'used by',uses(i).map(x=>x[0]).join(', '));return i;};
const edOwn=(node,o,nw)=>{const v=M[node];const k=v.p.findIndex(p=>Array.isArray(p)&&typeof p[0]==='string'&&p[0].includes(o));if(k<0||v.p.filter(p=>Array.isArray(p)&&typeof p[0]==='string'&&p[0].includes(o)).length!==1)throw new Error('own anchor '+node);const s=v.p[k][0];v.p[k]=[rep(s,o,nw)];v.n+=v.p[k][0].length-s.length;console.log('own line',node,'+'+(v.p[k][0].length-s.length));};
const B3=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
// 1. reuse the send-back's two lines (the confirmed set __cc and the line test __ecC) in the three enforcer builders, just before the E-COL item loop
const CC=one("const __cc=(()=>{const L=new Set();for(const [n,k] of [['Close Enforcer Record','cec']"),EC=one('const __ecC=l=>{');if(EC!==CC+1)throw new Error('not consecutive');
const LOOP=one("for(const g of CG){ci++;const __efg=efgCheck(g.line,R);");
for(const n of B3){const v=M[n];if(has(v,CC)||has(v,EC))throw new Error('already has '+n);const k=v.p.findIndex(p=>p===LOOP||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=LOOP&&LOOP<=p[1]));const p=v.p[k];
 const ins=[[CC,EC]];const parts=p===LOOP?[...ins,LOOP]:[...(p[0]<LOOP?[p[0]===LOOP-1?LOOP-1:[p[0],LOOP-1]]:[]),...ins,(p[1]>LOOP?[LOOP,p[1]]:LOOP)];
 v.p.splice(k,1,...parts);v.n+=L[CC].length+1+L[EC].length+1;console.log('map',n,'+lines',CC,EC,'+'+(L[CC].length+L[EC].length+2));}
// 2. the E-COL loop sets such lines aside
edLib("for(const g of CG){ci++;const __efg=efgCheck(g.line,R);","const __ECC=[];for(const g of CG){if(!__rp10F(g.line)&&__ecC(g.line)){__ECC.push(g);continue;} /* pkgECS */ci++;const __efg=efgCheck(g.line,R);");
// 3. each set-aside line is recorded by code, per judge who wrote it
const ROW=r=>"for(const g of __ECC)for(const __s of g.seats)code_rows.push({run_token:S.run_token,seat:__s,seat_role:'"+r+"',judge_model:null,kind:'enforcer_check',rule:'E-COL',item:'COLLISION '+((g.line.replace(/[*_`]+/g,'').match(/^(D\\d+\\s*vs\\.?\\s*C\\d+)/i)||[])[1]||''),flagged_line:g.line.slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:g.line.slice(0,700),cure_status:null,cure_reason:'NOT ASKED (code, pkgECS): the line grades a link the engine broke by a confirmed closing contradiction; E-COL does not apply to that break, as the send-back does not send it (pkgECB)',at:T0});";
edLib("for(const __s of Object.keys(__FC))code_rows.push({run_token:S.run_token,seat:__s,seat_role:'alternate',","for(const __s of Object.keys(__FC))code_rows.push({run_token:S.run_token,seat:__s,seat_role:'alternate',".replace(/^/,ROW('alternate')));
edOwn('Judge Enforcer Build',"for(const __s of Object.keys(__FC))code_rows.push({run_token:S.run_token,seat:__s,seat_role:'panel',",ROW('panel')+"for(const __s of Object.keys(__FC))code_rows.push({run_token:S.run_token,seat:__s,seat_role:'panel',");
// 4. the stubs name the two nodes the confirmed set reads (the task runner sends a Code node only the nodes its stub names)
for(const n of B3){const s=by[n].parameters.jsCode;const m=s.match(/if\(false\)\{([^}]*)\}/);const names=[...m[1].matchAll(/\$\("([^"]+)"\)/g)].map(x=>x[1]);if(m[1].includes('$(String())'))continue;
 const nn=[...new Set([...names,'Close Enforcer Record','Judge Contradiction Record'])].sort();by[n].parameters.jsCode=s.replace(m[0],'if(false){'+nn.map(x=>'$('+JSON.stringify(x)+');').join('')+'}');console.log('stub',n,'+'+(by[n].parameters.jsCode.length-s.length));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0,changed=[];for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');if(s!==before[n])changed.push(n);fs.mkdirSync('pkgECS/src',{recursive:true});if(B3.includes(n)){fs.writeFileSync('pkgECS/src/'+n.replace(/ /g,'_')+'.new.js',s);fs.writeFileSync('pkgECS/src/'+n.replace(/ /g,'_')+'.old.js',before[n]);}}
console.log('stubs rebuilt and compiled:',ok,'| rebuilt sources that changed:',changed.join(', '));
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
console.log('SIZE (measured): Shared Library',nc.length-c.length,'| all Code nodes',code(W)-code(W0),'| rebuilt sources',B3.map(n=>n+' '+(M[n].n-before[n].length)).join('; '));
const diff=W.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(W0.nodes.find(z=>z.name===n.name))).map(n=>n.name);
console.log('workflow nodes changed',diff,'| node count',W.nodes.length,'| connections equal',JSON.stringify(W.connections)===JSON.stringify(W0.connections));
fs.writeFileSync(outF,JSON.stringify(D));console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
