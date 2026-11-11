// pkgRTE (W3, offline): the two faults of the dry regrade 34780 (grade_34780.md section 5; confirmed by W4 Wall 4491 and W1 Wall 4492).
// F1 (part RT): the send-back applier reads "RETRACTED: <pair> -- <reason>" as it reads "RETRACTED: <pair>" (two library lines, the 10 gate and merge nodes).
// F2 (part EJ): the three Send Back Build nodes also withhold items on a judge's own "<side> LINK BROKEN" collision line of a confirmed side and link (no engine mark needed), and so the FORCED lines of that pair.
// Surgical Shared Library edit. usage: node pkgRTE/build_RTE.cjs <parent> <out> [RT|EJ|BOTH]
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF,part='BOTH']=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o);return s.replace(o,()=>n);};
const RO="/^RETRACTED\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\s*\\.?$/i";
const RN="/^RETRACTED\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\s*(?:\\.?$|(?:--|[\\u2013\\u2014])(?!.*\\b(?:NOT\\s+(?:RETRACTED|WITHDRAWN)|STANDS?|KEEP|KEPT|REMAINS?)\\b))/i";
const EO="const m=t.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b/i),a=t.match(/\\[AUDIT: LINK (\\d+) BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- (DEFENDER|CHALLENGER)\\b/);return m&&a&&__cc.has(a[2]+' '+a[1])&&(a[2]==='DEFENDER'?m[1]:m[2])===a[1]?'D'+m[1]+' VS C'+m[2]:null;};";
const EN="const m=t.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b/i),a=t.match(/\\[AUDIT: LINK (\\d+) BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- (DEFENDER|CHALLENGER)\\b/),g=a?a[2]:(t.match(/^D\\d+\\s+vs\\.?\\s+C\\d+\\s*(?:\\([^)]*\\))?\\s*:\\s*(DEFENDER|CHALLENGER) LINK BROKEN\\b/)||[])[1],n=m&&g&&(g==='DEFENDER'?m[1]:m[2]);return n&&(!a||a[1]===n)&&__cc.has(g+' '+n)?'D'+m[1]+' VS C'+m[2]:null;};";
const E=[];
if(part!=='EJ'){E.push([one("if(!o){const __rt=ri5Rt2024(nrm(to),"+RO),l=>rep(l,RO,RN)]);E.push([one("if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}{const __rt=ri5Rt2024(nrm(to),"+RO),l=>rep(l,RO,RN)]);}
if(part!=='RT')E.push([one("const __ecC=l=>{"),l=>rep(l,EO,EN)]);
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
let tot=0;for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;tot+=d;for(const [n,v] of uses(i))v.n+=d;console.log('library line',i+1,(d>=0?'+':'')+d,'used by',uses(i).length,'nodes:',uses(i).map(x=>x[0]).join(', '));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): Shared Library',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'code; source lines',(tot>=0?'+':'')+tot);
fs.writeFileSync(outF,JSON.stringify(D));
