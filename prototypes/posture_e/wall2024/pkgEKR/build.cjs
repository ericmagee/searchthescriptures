// pkgEKR (W2): the DeepSeek E-KEY and E-RES checks are not asked about a line that rests on the engine's own CONFIRMED closing contradiction
// (Close Enforcer Record or Judge Contradiction Record, the set __cc that pkgECS brings into the three enforcer builders):
//  E-KEY: a KEYSTONE line graded BROKEN on a link in that set (DEFENDER for D<n>, CHALLENGER for C<n>);
//  E-RES: a RESULT line "CHALLENGER WINS" whose reason names a contradiction, when the set holds a DEFENDER break (the engine's BROKEN-1 then gives CHALLENGER WINS).
// Each such line is recorded by code as NOT ASKED. Built on the joint parent PCS+ECS+RRT (needs pkgECS's __cc in the builders), pkgLIB form-3 map.
// usage: node pkgEKR/build.cjs <base fetch-back> <out>
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
const edOwn=(node,o,nw)=>{const v=M[node];const ks=v.p.map((p,k)=>Array.isArray(p)&&typeof p[0]==='string'&&p[0].includes(o)?k:-1).filter(k=>k>=0);if(ks.length!==1)throw new Error('own anchor '+node);const k=ks[0];const s=v.p[k][0];v.p[k]=[rep(s,o,nw)];v.n+=v.p[k][0].length-s.length;console.log('own line',node,'+'+(v.p[k][0].length-s.length));};
const B3=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
// the three builders must already carry pkgECS's __cc (library line before the E-COL loop)
const CC=one("const __cc=(()=>{const L=new Set();for(const [n,k] of [['Close Enforcer Record','cec']");for(const n of B3)if(!has(M[n],CC))throw new Error('no pkgECS __cc in '+n);
// 1. set-aside tests, beside the keystone list
edLib("const KG=[];","const KG=[],__EKR=[];const __ekK=g=>{const m=String(g.link||'').match(/^([DC])(\\d+)$/);return !!m&&/^BROKEN\\b/.test(g.grade||'')&&__cc.has((m[1]==='D'?'DEFENDER ':'CHALLENGER ')+(+m[2]));};const __ekR=r=>/^RESULT\\s*:\\s*CHALLENGER WINS\\b/.test(r)&&/contradict/i.test(r)&&[...__cc].some(k=>k.startsWith('DEFENDER ')); /* pkgEKR */");
// 2. E-KEY: such a keystone line is not asked
edLib("for(const g of KG){zi++;const id='Z'+zi+'.1';","for(const g of KG){if(__ekK(g)){__EKR.push(g);continue;} /* pkgEKR */zi++;const id='Z'+zi+'.1';");
// 3. rows by code: E-KEY rows where pkgECS writes its rows; the role is fixed there (alternate in the library line, panel in Judge Enforcer Build's own line)
const ROWK=r=>"const __ekRole='"+r+"';for(const g of __EKR)code_rows.push({run_token:S.run_token,seat:g.seat,seat_role:__ekRole,judge_model:null,kind:'enforcer_check',rule:'E-KEY',item:'KEYSTONE '+g.link,flagged_line:g.line.slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:g.line.slice(0,700),cure_status:null,cure_reason:'NOT ASKED (code, pkgEKR): the keystone link was broken by the engine on a confirmed closing contradiction; BROKEN follows from that break',at:T0}); /* pkgEKR */";
const ECSROW="for(const g of __ECC)for(const __s of g.seats)code_rows.push({run_token:S.run_token,seat:__s,seat_role:'";
edLib(ECSROW+"alternate',",ROWK('alternate')+ECSROW+"alternate',");
edOwn('Judge Enforcer Build',ECSROW+"panel',",ROWK('panel')+ECSROW+"panel',");
// 4. E-RES: such a RESULT line is not asked; its row is written at once
edLib("if(!res||/^RESULT\\s*:\\s*[A-Z ]+?\\s*(?:--|—|–)\\s*recomputed after the cure/i.test(res))continue;ri++;",
 "if(!res||/^RESULT\\s*:\\s*[A-Z ]+?\\s*(?:--|—|–)\\s*recomputed after the cure/i.test(res))continue;if(__ekR(res)){code_rows.push({run_token:S.run_token,seat:j.seat,seat_role:__ekRole,judge_model:null,kind:'enforcer_check',rule:'E-RES',item:'RESULT REASON',flagged_line:res.slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:res.slice(0,700),cure_status:null,cure_reason:'NOT ASKED (code, pkgEKR): the reason rests on the engine\\'s confirmed closing contradiction, which breaks a defender link; CHALLENGER WINS follows from that break',at:T0});continue;} /* pkgEKR */ri++;");
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0,changed=[];fs.mkdirSync('pkgEKR/src',{recursive:true});for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');if(s!==before[n])changed.push(n);if(B3.includes(n)){fs.writeFileSync('pkgEKR/src/'+n.replace(/ /g,'_')+'.new.js',s);fs.writeFileSync('pkgEKR/src/'+n.replace(/ /g,'_')+'.old.js',before[n]);}}
console.log('stubs rebuilt and compiled:',ok,'| rebuilt sources that changed:',changed.join(', '));
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
console.log('SIZE (measured): Shared Library',nc.length-c.length,'| all Code nodes',code(W)-code(W0),'| rebuilt sources',B3.map(n=>n+' '+(M[n].n-before[n].length)).join('; '));
const diff=W.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(W0.nodes.find(z=>z.name===n.name))).map(n=>n.name);
console.log('workflow nodes changed',diff,'| node count',W.nodes.length,'| connections equal',JSON.stringify(W.connections)===JSON.stringify(W0.connections));
fs.writeFileSync(outF,JSON.stringify(D));console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
