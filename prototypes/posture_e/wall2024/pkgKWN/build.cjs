// W2 offline builds from run 34852 findings (Wall 4571, second seat W4 4573), on live s119.
// F1 pkgKWN: the K-W NOT HELD reader reads NOT HELD at the start of the line OR after a lead sentence ("Fact granted: ... . NOT HELD: ..."); the quote test reads the text from NOT HELD on.
// F2 pkgG4M: a gate K-G4 item whose GROUND names no pressed witness left unanswered (a meaning break, ruling 421) tells the judge that a PRESSED line does not cure it and gives the FORCED form (the same form the answered-witness note already gives).
// usage: node pkgKWN/build.cjs <fetch-back> <out> <F1|F2|F1F2|F3|...>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF,which]=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o);return s.replace(o,()=>n);};
const E=[];
if(/F1/.test(which))E.push([one("for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\\s*NOT\\s+HELD\\b/i.test(t))continue;const T="),l=>rep(l,
 "for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\\s*NOT\\s+HELD\\b/i.test(t))continue;const T=",
 "for(const [t0,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){const __h=String(t0||'').search(/(?:^|[.;!?][\"\\u201d'\\u2019)\\]]*\\s+)\\**NOT\\s+HELD\\b/i);if(__h<0)continue;const t=String(t0).slice(__h); /* pkgKWN: NOT HELD after a lead sentence */const T=")]);
if(/F2/.test(which)){
 E.push([one("if(!CURE_PRESS[side]||!g4Unans2024(line))return '';const hits=[];"),l=>rep(l,"if(!CURE_PRESS[side]||!g4Unans2024(line))return '';",
  "const __F=' Cure it with one FORCED line: FORCED: '+(link?link.replace(/ VS /,' vs '):'D<i> vs C<j>')+' -- MEANS [<round>]: \"<the MEANS sentence>\" -- ANSWER [<round>]: \"<the holding side\\'s answer>\" -- FAILS: \"<the words of that answer that cannot take the meaning, quoted>\", or with a CHANGE TO that no longer breaks the link.';if(!CURE_PRESS[side])return '';if(!g4Unans2024(line))return ' THE ENGINE READS THIS LINE: its GROUND names no pressed witness left unanswered, so the break rests on meaning (ruling 421): a KEEP, a PRESSED line or a CHANGE TO that still breaks the link stays uncured without a FORCED line.'+__F; /* pkgG4M */")]);
 E.push([one("So the break rests on meaning (ruling 421): a KEEP, or a CHANGE TO that still says the witness was left unanswered, stays uncured. Cure it with one FORCED line: FORCED: '+"),l=>rep(l,
  "stays uncured. Cure it with one FORCED line: FORCED: '+(link?link.replace(/ VS /,' vs '):'D<i> vs C<j>')+' -- MEANS [<round>]: \"<the MEANS sentence>\" -- ANSWER [<round>]: \"<the holding side\\'s answer>\" -- FAILS: \"<why that answer cannot take the meaning>\", or with a CHANGE TO that no longer breaks the link.';",
  "stays uncured.'+__F;")]);}
if(/F3/.test(which)){const o=', on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4),';
 E.push([one(o),l=>rep(l,o,' (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."),')]);} /* pkgEHF: the E-HOLD send-back text names the FORCED form, as the Record copy does */
if(/F4/.test(which)){const o=', and give the FORCED line when the gate asks for it (K-G4, ruling 421);';
 E.push([one(o),l=>rep(l,o,', with its FORCED line (K-G4, ruling 421);')]);} /* pkgEHF rev 2: the BROKEN-grade rule asks for the FORCED line with the change, not later */
const uses=i=>Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));
for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;for(const [n,v] of uses(i))v.n+=d;console.log('line',i,(d>=0?'+':'')+d,'used by',uses(i).length,'nodes:',uses(i).map(x=>x[0]).join(', '));}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): code',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'| fixed prompt text 0 (the F2 note is built only for a gate K-G4 item on a meaning break)');
fs.writeFileSync(outF,JSON.stringify(D));
