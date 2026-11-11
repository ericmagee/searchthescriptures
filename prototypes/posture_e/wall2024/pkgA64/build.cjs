// W2 ASK 64 measurement builds on live s127 (offline, not for writing until graded and asked).
// O1: the DeepSeek answer check follows the judges' rule: RULE E-ANS also counts any later round of the side that quotes the verse or names it by
//     reference, and each E-ANS item is given THE SIDE'S OTHER LINES ON THIS VERSE (paragraphs of the answering round and the side's later rounds
//     that name the pressed verse, outside the answer already shown; cut at 900).
// O2: the check stays record-only: E-ANS DISAGREE / NO ANSWER rows no longer enter the send-back (Send Back Build, Alt, R2 Alt); they stay in the record.
// usage: node pkgA64/build.cjs <fetch-back> <out> <O1|O2>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const [,,inF,outF,which]=process.argv;let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o.slice(0,80));return s.replace(o,()=>n);};
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
const edLib=(anchor,f)=>{const i=one(anchor);const o=L[i];L[i]=f(o);const d=L[i].length-o.length;for(const [n,v] of uses(i))v.n+=d;console.log('lib line',i,(d>=0?'+':'')+d,'used by',uses(i).map(x=>x[0]).join(', '));};
const edOwn=(node,anchor,f)=>{const v=M[node];let hit=0;v.p.forEach((p,k)=>{if(Array.isArray(p)&&typeof p[0]==='string'&&p[0].includes(anchor)){const o=p[0];v.p[k]=[f(o)];v.n+=v.p[k][0].length-o.length;hit++;console.log('own line of',node,(v.p[k][0].length-o.length>=0?'+':'')+(v.p[k][0].length-o.length));}});if(hit!==1)throw new Error('own anchor hits '+hit);};
let promptD=0;
if(which==='O1'){
 const R0="The answer is every line the answering side wrote under the pressed verse, up to the next pressed verse, its layers included;";
 const R1="The answer is every line the answering side wrote under the pressed verse, up to the next pressed verse, its layers included, and also any line of a later round of that side (its round 2, its link round or, for the defender, its close round [CR4]) or of another block of the same round that quotes the verse or names it by reference, as THE SIDE'S OTHER LINES ON THIS VERSE shows; an answer given there, or one the answer points to (\"answered under link 3\"), counts as the answer;";
 promptD=R1.length-R0.length;edLib("const RULES='RULE E-ANS (an answer to a pressed verse). "+R0,l=>rep(l,R0,R1.replace(/'/g,"\\'")));
 const A0="if(__eb&&ids[0])ids[0].eaw_blk=__eb.t.slice(0,4000);";
 const A1=A0+"const __ol=(()=>{try{const k0=__rk[0],sd=k0.slice(0,2),r0=+k0[2];const okR=sd==='CR'?[2,3,4]:[1,2,3];const re=new RegExp('(?<![A-Za-z0-9])'+String(g.verse).trim().replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&').replace(/\\s+/g,'\\\\s*')+'(?![0-9])','i');const own=N(__eb?__eb.t:''),aw=N(g.answer).slice(0,60);const out=[];for(const n of okR){if(n<r0)continue;const k=sd+n;if(!R||typeof R[k]!=='string')continue;for(const p of R[k].split(/\\n\\s*\\n/)){if(!re.test(p))continue;const np=N(p);if((own&&own.includes(np))||(aw&&np.includes(aw)))continue;out.push('['+k+'] '+p.trim());}}return out.length?out.join('\\n'):'';}catch(e){return '';}})(); /* ASK 64 option 1 (W2 measure build) */";
 edLib(A0,l=>rep(l,A0,A1));
 const P0="'\"':'')+'\\nTHE JUDGES\\' GRADES:\\n'+ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,400)).join('\\n')});";
 const P1="'\"':'')+(__ol?'\\nTHE SIDE\\'S OTHER LINES ON THIS VERSE (its later rounds, and other blocks of this round, that name the pressed verse): \"'+cut(__ol,900)+'\"':'')+'\\nTHE JUDGES\\' GRADES:\\n'+ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,400)).join('\\n')});";
 edLib("items.push({ids,text:'ITEM B'+gi+' (E-ANS;",l=>rep(l,P0,P1));}
if(which==='O2'){const F0="x.rule!=='K-W'&&x.rule!=='K-CON'  &&/^ENFORCER (?:DISAGREE|NO ANSWER)";const F1="x.rule!=='K-W'&&x.rule!=='K-CON'&&x.rule!=='E-ANS'&&/^ENFORCER (?:DISAGREE|NO ANSWER)";
 edLib("const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate'&&",l=>rep(l,F0,F1));edOwn('Send Back Build',"const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='panel'&&",l=>rep(l,F0,F1));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok,'| SIZE (measured): code',nc.length-c.length>=0?'+'+(nc.length-c.length):nc.length-c.length,'| fixed prompt text',(promptD>=0?'+':'')+promptD,'(RULE E-ANS, sent once per check call)');
fs.writeFileSync(outF,JSON.stringify(D));
