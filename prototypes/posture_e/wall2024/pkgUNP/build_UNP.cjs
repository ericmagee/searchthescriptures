// pkgUNP (W2, run 33149): pkgUND's pressed() numbered the premises of the list closing [DR2] and took premise n as pressing D<n>. The list names
// the link each premise presses ("5. LINK 3: Defender's words: ..."), so premise 5 pressed D3, not D5. In 33149 every E-UNG item was false
// (gemini D5, sol D5, chatgpt D1 and D5: D1 and D5 were pressed by no premise; the list pressed D6 (x3), D2, D3, D4).
// Fix: a premise that names "LINK k" presses D<k>; one with no LINK token keeps its place number (pkgUND's reading). Each pressed link is listed
// once (first premise). The E-UNG item names both: "COLLISION D<k> (pressed: [DR2] premise <n>)". Base: pkgABS/patched (live 7796fc67/ff8967bb
// Send Back nodes; pkgKGW touched only library nodes). Run from wall2024/: node pkgUNP/build_UNP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgABS/patched',OUT='pkgUNP/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,60));return s.replace(a,()=>b);};
const PA="return its.map((x,k)=>({n:k+1,none:/^\\s*\\**\\s*LINK\\s+none/i.test(x),head:x.replace(/\\s+/g,' ').trim().slice(0,160)})).filter(x=>!x.none);}";
const PB="const __seenL=new Set();return its.map((x,k)=>{const lk=x.match(/^\\s*\\**\\s*(?:\\d+[.)]\\s*)?\\**\\s*LINK\\s+(\\d+)\\b/i);return {n:lk?+lk[1]:k+1,p:k+1,none:/^\\s*\\**\\s*(?:\\d+[.)]\\s*)?\\**\\s*LINK\\s+none/i.test(x),head:x.replace(/\\s+/g,' ').trim().slice(0,160)};}).filter(x=>!x.none&&!__seenL.has(x.n)&&__seenL.add(x.n));} /* pkgUNP: a premise presses the link it names (LINK k -> D<k>), once */";
const MA="return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,premise:p.head,line:ownLine(text,p.n)}));";
const MB="return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,p:p.p||p.n,premise:p.head,line:ownLine(text,p.n)}));";
const LA="item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+__m.n+')'";const LB="item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+(__m.p||__m.n)+')'";
for(const f of ['Send_Back_Build.js','Alt_Send_Back_Build.js','Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=rep(s0,PA,PB,f);s=rep(s,MA,MB,f);let k=2;
 if(/Build/.test(f)){s=rep(s,LA,LB,f);k++;}new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:BASE,base_sha:sha(s0),final_sha:sha(s),edits:k});console.log(f.padEnd(26),sha(s0),'->',sha(s),k+' edits');}
fs.writeFileSync('pkgUNP/plan_UNP.json',JSON.stringify(plan,null,1));
