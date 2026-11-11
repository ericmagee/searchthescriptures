// pkgV59 (W1, offline; W3 Wall 4536 fault 5a; W1 Wall 4548): the operator's verdict ruling (md_notes_rulings row 459):
// "a collision point answered with a fit and not answered back does NOT count toward a defender win".
// In the code recompute (cureRecompute), when the judge's RESULT is DEFENDER WINS, a CHALLENGER LINK BROKEN line counts toward it only when the judge's text holds a
// FORCED line for that pair whose ANSWER quotes a challenger round ([DR1] to [DR3]): the challenger answered back and the answer failed. Any other such line (no FORCED line,
// or a FORCED line quoting the defender's [CR] answer) is not counted: it is left out of the challenger's break count, of the tie rule and of the section 8 HELD test,
// and the trigger "RULING 459 <pair> (...)" is written into the recomputed RESULT line. Engine (closing-contradiction) breaks are untouched. Form is read, not meaning.
// usage: node pkgV59/build_V59.cjs <parent> <out>
const fs=require('fs');const crypto=require('crypto');const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)throw new Error('not a stub');const $=n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:lib}};};return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};const [,,inF,outF]=process.argv;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);const by={};W.nodes.forEach(n=>by[n.name]=n);
const SL=by['Shared Library'];const c=SL.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));const before={};for(const n of Object.keys(M))if(by[n])before[n]=rebuild(by[n].parameters.jsCode,c);
const one=s=>{const i=L.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(i.length!==1)throw new Error('not one line: '+s+' '+i);return i[0];};
const rep=(s,o,n)=>{if(s.split(o).length!==2)throw new Error('anchor not once: '+o);return s.replace(o,()=>n);};
const E=[];
// 1. after __r0421: the pairs a FORCED line answers from a challenger round; the lines not counted; the trigger
const A1="const __r0421=P.result?";
const N1="const __F459=String(text||'').split('\\n').map(z=>{const m=z.replace(/[*_`]+/g,'').trim().match(/^FORCED\\s*:\\s*D(\\d+)\\s+vs\\.?\\s+C(\\d+)\\b.*\\bANSWER\\s*\\[\\s*DR[1-3]\\s*\\]/i);return m?'D'+m[1]+' VS C'+m[2]:null;}).filter(Boolean);const __x459=z=>z.grade==='CHALLENGER LINK BROKEN'&&!z.cec&&!__F459.includes(U(z.link).replace(/\\s+VS\\.?\\s+/,' VS ').trim()); /* pkgV59 */\n";
E.push([one(A1+"((ri5Res2024"),l=>rep(l,A1,N1+A1)]);
const A2="const __tie421=(cl,a1,a2,n1,n2,r)=>";
const N2="const __n459=__r0421==='DEFENDER WINS'?col.filter(__x459):[];if(__n459.length)trig.push('RULING 459 '+__n459.map(z=>z.link).join(', ')+' (CHALLENGER LINK BROKEN with no FORCED line quoting the challenger\\'s answer back in [DR1] to [DR3]: not counted toward a defender win)');const __c459=__n459.length?col.filter(z=>!__x459(z)):col; /* pkgV59 */\n";
E.push([one(A2),l=>rep(l,A2,N2+A2)]);
// 2. the challenger's break count leaves them out
const A3="CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length+__cecX.CHALLENGER}; /* pkgCEC */";
E.push([one(A3),l=>rep(l,A3,A3.replace("CHALLENGER:col.filter","CHALLENGER:__c459.filter"))]);
// 3. the tie rule and the section 8 HELD test after the recompute
const A4="(__x=>{if(__tie421(col,dst,cst,";const A5="return (r0&&r0!=='CHALLENGER WINS')?r0:'UNDERDETERMINED';})());";
E.push([one(A4),l=>rep(rep(l,A4,"(__x=>{if(__tie421(__c459,dst,cst,"),A5,"return (r0&&r0!=='CHALLENGER WINS')?(__n459.length&&r0==='DEFENDER WINS'&&cst==='SELF-SUPPORTED'&&!brk.CHALLENGER?'UNDERDETERMINED':r0):'UNDERDETERMINED';})());")]);
// 4. the no-cure pass applies the recompute when the trigger is written
const A6="if(rc&&(rc.trig.indexOf('TIE (KB-0030)')>=0||rc.trig.some(t=>/^CLOSE-CONTRADICTION /.test(t)))){";
E.push([one(A6),l=>rep(l,A6,A6.replace("/^CLOSE-CONTRADICTION /","/^(?:CLOSE-CONTRADICTION|RULING 459) /"))]);
const occ=(v,i)=>v.p.filter(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])).length;const uses=i=>Object.entries(M).filter(([n,v])=>occ(v,i)>0);
let tot=0;const seen={};for(const [i,f] of E){const o=L[i];L[i]=f(o);if(L[i]===o)throw new Error('no change at '+i);const d=L[i].length-o.length;tot+=d;for(const [n,v] of uses(i))v.n+=d*occ(v,i);console.log('library line',i+1,(d>=0?'+':'')+d,'used by',uses(i).length,'nodes');}
// 5. the same no-cure pass in Panel Cure Check is a node-own line held in the map
{const B="rc.trig.some(t=>/^CLOSE-CONTRADICTION /.test(t)))){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,rc,s.seat,F0)";let hit=0;const walk=(x,n,v)=>{if(Array.isArray(x))return x.map(z=>walk(z,n,v));if(typeof x==='string'&&x.includes(B)){hit++;const y=rep(x,B,B.replace('/^CLOSE-CONTRADICTION /','/^(?:CLOSE-CONTRADICTION|RULING 459) /'));v.n+=y.length-x.length;console.log('node-own line in',n,'+'+(y.length-x.length));return y;}return x;};for(const [n,v] of Object.entries(M))v.p=walk(v.p,n,v);if(hit!==1)throw new Error('Panel Cure Check anchor hits '+hit);}
const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);
const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
SL.parameters.jsCode=nc;let ok=0;for(const n of Object.keys(before)){const s=rebuild(by[n].parameters.jsCode,nc);if(s.length!==M[n].n)throw new Error('length '+n+' '+s.length+' vs map '+M[n].n);ok++;new Function('$','$input','return (async()=>{\n'+s+'\n})');}
console.log('stubs rebuilt and compiled:',ok);console.log('SIZE (measured): Shared Library',c.length,'->',nc.length,'=',(nc.length-c.length>=0?'+':'')+(nc.length-c.length),'code; prompt 0');
fs.writeFileSync(outF,JSON.stringify(D));console.log('wrote',outF,'sha',crypto.createHash('sha256').update(fs.readFileSync(outF)).digest('hex').slice(0,16));
