// W2 pkgEAF (coordinator 23:15 CST 11-10; cause B of Wall 4729/4730, two seats): THE ANSWER IN FULL at item level (E-ANS, LIB 3195-3196).
// A: the grant-or-short gate is dropped: the full block is served whenever a finder finds a block longer than the answer + 60 (the old second test, kept).
// S: smallest form: the gate stays, and is also passed when another E-ANS item presses the same verse in the same round (the two-grades case, Matthew 1:6 B12/B57).
// U: backslash-escaped quote marks in the judge's quoted answer are removed before the finders and the opening-words test read it (terra's \" quotes).
// usage: node pkgEAF/build.cjs <fetch-back> <out> <A|S>[U]
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF,which]=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o);return s.replace(o,()=>n);};
const E=[];const U=/U/.test(which);
const G0="const __eg=b=>b&&(/^\\s*(?:(?:i\\s+)?grant|i\\s+concede|i\\s+accept|granted)\\b/i.test(N(g.answer))||N(g.answer).length<60)&&N(b.t).length>N(g.answer).length+60?b:null;";
const F0="const __eb=__eg(eawBlock(R,__erk,g.verse,g.answer))||__eg(eawBlockMeans(R,__erk,g.means,g.answer))||__eg(eaiBlock(R,__erk,g.answer));";
const I0="const __aw=N(g.answer).split(' ').slice(0,8).join(' ');";
const ga=U?'__ga':'g.answer';
if(U)E.push([one(I0),l=>rep(l,I0,"const __ga=String(g.answer).replace(/\\\\+\"/g,'\"'); /* pkgEAF U: a quote mark the judge escaped is read as a quote mark */const __aw=N(__ga).split(' ').slice(0,8).join(' ');")]);
let G1;if(/A/.test(which))G1="const __eg=b=>b&&N(b.t).length>N("+ga+").length+60?b:null; /* pkgEAF A: served for every answer, not only a grant or a short one */";
else if(/S/.test(which))G1="const __eg=b=>b&&(/^\\s*(?:(?:i\\s+)?grant|i\\s+concede|i\\s+accept|granted)\\b/i.test(N("+ga+"))||N("+ga+").length<60||AG.filter(x=>x.verse===g.verse&&x.rk===g.rk).length>1)&&N(b.t).length>N("+ga+").length+60?b:null; /* pkgEAF S: also when two items press one verse in one round */";
const F1=U?"const __eb=__eg(eawBlock(R,__erk,g.verse,__ga))||__eg(eawBlockMeans(R,__erk,g.means,__ga))||__eg(eaiBlock(R,__erk,__ga));":F0;
E.push([one(G0),l=>{let s=G1?rep(l,G0,G1):l;if(U)s=rep(s,F0,F1);return s;}]);
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;for(const [n,v] of uses(i))v.n+=d;console.log('line',i,(d>=0?'+':'')+d,'used by',uses(i).length,'nodes:',uses(i).map(x=>x[0]).join(', '));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): code',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'| fixed prompt text 0');
fs.writeFileSync(outF,JSON.stringify(D));
