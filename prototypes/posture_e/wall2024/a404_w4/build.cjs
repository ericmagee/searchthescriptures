// ASK 404 build (plan W3 8654, rev 1 8658, rev 2 8665; grades W1 8655/8664/8667, W2 8656/8666). Rulings row 494. Offline.
// Library: rd386 BROKEN branch + its comment (1286); E-RES check (3142). Engine prompts: the one Line 2 sentence in Panel Build and Build Independent Verdict.
// Usage: node a404/build.cjs IN OUT [--child]
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT,CH]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;const log=[];
const rep=(i,a,b)=>{const n=L[i].split(a).length-1;if(n!==1)throw new Error('line '+i+': found '+n+' times: '+a.slice(0,80));L[i]=L[i].replace(a,()=>b);log.push('L'+i);};
// 2a. rd386: BROKEN gives CHALLENGER WINS only on a SELF-SUPPORTED challenge
rep(1286,"let r;if(w==='BROKEN')r='CHALLENGER WINS';",
 "let r;if(w==='BROKEN'){if(!i.cst)return {word:null,tie:false,why:'no challenge standing'};r=i.cst==='SELF-SUPPORTED'?'CHALLENGER WINS':'UNDERDETERMINED';} /* ASK 404 (rulings row 494; Wall 8654, 8658, 8665): BROKEN gives CHALLENGER WINS only when the challenge is SELF-SUPPORTED; a challenge resting on an unproven fact (PROP-DEPENDENT or COLLAPSED) gives UNDERDETERMINED; no challenge standing gives no word, as on HELD */");
// rd386 comment (W1 8667): the BROKEN rule and the no-word rule
rep(1286,"STANDINGS, RESULT and VERDICT DEFINITIONS: BROKEN gives CHALLENGER WINS; HELD gives","STANDINGS, RESULT and VERDICT DEFINITIONS: BROKEN gives CHALLENGER WINS when the challenge is SELF-SUPPORTED and UNDERDETERMINED otherwise (ASK 404, rulings row 494); HELD gives");
rep(1286,"No verdict, or HELD with no challenge standing, gives no word. */const w=","No verdict, or HELD or BROKEN with no challenge standing, gives no word. */const w=");
// 2f. E-RES (ruling 443) at 3142: the judge is checked against the same rule, read from its own CHALLENGE STANDING line
rep(3142,"  if(/^BROKEN/.test(cla)&&!/^RESULT\\s*:\\s*CHALLENGER WINS\\b/.test(res))cv(j.seat,res,'\"BROKEN gives CHALLENGER WINS\", but the clause is '+cla+' and the RESULT is not CHALLENGER WINS');",
 "  if(/^BROKEN/.test(cla)){const __cs404=(cs.match(/^CHALLENGE STANDING\\s*:\\s*([A-Z-]+)/)||[])[1]||'';const __w404=__cs404==='SELF-SUPPORTED'?'CHALLENGER WINS':(__cs404==='PROP-DEPENDENT'||__cs404==='COLLAPSED')?'UNDERDETERMINED':null;if(__w404&&!new RegExp('^RESULT\\\\s*:\\\\s*'+__w404+'\\\\b').test(res))cv(j.seat,res,'\"BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED, and UNDERDETERMINED when it is PROP-DEPENDENT or COLLAPSED\", but the clause is '+cla+', the CHALLENGE STANDING is '+__cs404+' and the RESULT is not '+__w404);} /* ASK 404 site 2f (Wall 8663 item 4, 8665): the seat's own CHALLENGE STANDING line decides the RESULT wanted; a missing or unread line checks nothing */");
// MAP lengths, header, library
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
// 2c. prompts (engine only): exactly one old sentence per node, refused otherwise
const OLD='BROKEN gives CHALLENGER WINS.',NEW='BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED, and UNDERDETERMINED when it is PROP-DEPENDENT or COLLAPSED.';
const PN=['Panel Build','Build Independent Verdict'];const pl=[];
if(!CH){for(const nm of PN){const n=d.nodes.find(x=>x.name===nm);const s=n.parameters.jsCode;const c=s.split(OLD).length-1;if(c!==1)throw new Error(nm+': old sentence found '+c+' times');n.parameters.jsCode=s.replace(OLD,()=>NEW);P(n.parameters.jsCode);pl.push(nm);}
 const other=d.nodes.filter(n=>!PN.includes(n.name)&&n.name!=='Shared Library'&&JSON.stringify(n.parameters).includes(OLD)).map(n=>n.name);if(other.length)throw new Error('old sentence also in '+other);}
else if(d.nodes.some(n=>n.name!=='Shared Library'&&JSON.stringify(n.parameters).includes(OLD)))throw new Error('child holds the old sentence');
fs.writeFileSync(OUT,JSON.stringify(d));console.log('lines changed',[...new Set(log)].join(' '),'| MAP lengths changed',ch.length,'| lib sha',lsha,'| prompts',pl.join(', ')||'none');
