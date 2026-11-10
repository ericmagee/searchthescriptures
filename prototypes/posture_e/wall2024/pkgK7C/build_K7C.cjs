// pkgK7C (W2, offline): K-G7 on a link the engine's confirmed closing contradiction broke is not a count item.
// Surgical Shared Library edit on the live fetch-back. usage: node pkgK7C/build_K7C.cjs <fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF]=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const HELP=' function k7cc2024(x){try{if(!x||x.rule!==\'K-G7\'||typeof cecBroken2024!==\'function\')return false;const m=String(x.link||\'\').match(/^D(\\d+)(?:\\s+vs\\.?\\s+C(\\d+))?/i);const n=m&&(x.side===\'DEFENDER\'?m[1]:m[2]);return !!n&&cecBroken2024().some(c=>c&&c.side===x.side&&String(c.link)===n);}catch(e){return false;}} /* pkgK7C: a K-G7 link the engine\'s confirmed closing contradiction broke; the engine itself does not count that link */';
const E=[[one('/* pkgKG7 (D40, W3 3093 ruling 3)'),l=>l+HELP],
 [one("if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res("),l=>l.replace("if(x.rule==='K-G7'){","if(x.rule==='K-G7'){if(k7cc2024(x))return res('CURED','the link is broken by the engine\\'s confirmed closing contradiction, which no count carries (pkgK7C)',[]);")],
 [one("if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!kg7Ans2024(y,R))"),l=>l.replace("if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!kg7Ans2024(y,R))","if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!k7cc2024(y)&&!kg7Ans2024(y,R))")]];
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;for(const [n,v] of uses(i))v.n+=d;console.log('line',i,'+'+d,'used by',uses(i).length,'nodes');}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length<before[n].length-0)throw new Error('shrank '+n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): Shared Library',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'code; prompt text: none added');
fs.writeFileSync(outF,JSON.stringify(D));
