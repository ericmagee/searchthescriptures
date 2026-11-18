// ASK 374 build (plan W3 8798 B, rev 2; reads W1 8799 with the f.n condition and plant 7, W2 8800). Two changes:
// B (engine only): D3 Build gains the C2 Build ASSUMES sentence with "defender" -> "challenger" (W3 line374B.txt at 9e04a545), after "and the premise may charge only what that quote says."
// A (engine and child Shared Library, line 1530): bnsRefuse2024 gains the mirror case: a COLLISION line graded DEFENDER LINK BROKEN on pair Dk vs Cm is NOT APPLIED while
//   E-ASSUME holds a BOTH NOT STATED fact with side CHALLENGER and premise n equal to m. Today's defender case is unchanged.
// Usage: node a374/build.cjs IN OUT engine|child LINEFILE
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT,KIND,LF]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));if(w.data&&w.data.nodes)w=w.data;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
if(KIND==='engine'){const LB=fs.readFileSync(LF,'utf8').replace(/\n$/,'');if(cr.createHash('sha256').update(LB).digest('hex').slice(0,12)!=='a20a076b3197')throw new Error('line374B sha');
 const n=w.nodes.find(x=>x.name==='D3 Build');const A='and the premise may charge only what that quote says.';const c=n.parameters.jsCode;if(c.split(A).length!==2)throw new Error('D3 anchor');
 if(c.includes('STEP: <the step of the challenger'))throw new Error('already present');n.parameters.jsCode=c.replace(A,()=>A+LB);P(n.parameters.jsCode);}
const U=T.unpack(w);const L=U.L,M=U.M;
const one=(f,label)=>{const ix=L.map((l,i)=>f(l)?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error(label+' count '+ix.length);return ix[0];};
const iB=one(l=>l.includes('function bnsRefuse2024('),'bnsRefuse2024 line');
const OLD="const m=(__r11&&__r11.form==='COLLISION'&&String(__r11.f.grade||'').toUpperCase()==='STANDS')?";
if(L[iB].split(OLD).length!==2)throw new Error('bns anchor');
const NEW="{const __g4=(__r11&&__r11.form==='COLLISION')?String(__r11.f.grade||'').toUpperCase():'';const __p4=__g4==='DEFENDER LINK BROKEN'?String(__r11.f.pair||'').match(/^D(\\d+)\\s+VS\\s+C(\\d+)$/i):null;if(__p4){const fc=bnsFacts2024().find(z=>z.side==='CHALLENGER'&&+z.n===+__p4[2]);return fc?'the change sets D'+__p4[1]+' vs C'+__p4[2]+' to DEFENDER LINK BROKEN, but E-ASSUME found the fact challenger premise '+__p4[2]+' ASSUMES, \"'+String(fc.fact).slice(0,160)+'\", BOTH NOT STATED: no quoted verse states it (pkgBNS, ASK 374). CHANGE TO the line graded without that fact, or KEEP, and the change stays unapplied.':null;}} /* ASK 374: the mirror of the defender case, matched on the challenger premise number */ "+OLD;
L[iB]=L[iB].replace(OLD,()=>NEW);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(w));console.log(KIND,'bns line',iB,'| MAP n changed',ch.length,'| lib sha',lsha);
