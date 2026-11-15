// ASK 330 build: assumed-fact form (ruling 460). Shared Library only.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'live.json',OUT=process.argv[3]||'target_330.json';
const d=JSON.parse(fs.readFileSync(IN));const U=T.unpack(d);const L=U.L,M=U.M;
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const has=(k,i)=>M[k].p.some(e=>typeof e==='number'?e===i:(typeof e[0]==='number'&&e[0]<=i&&i<=e[1]));
const RAISE=Object.keys(M).filter(k=>has(k,453)),CURE=Object.keys(M).filter(k=>has(k,1219)&&has(k,1227));
if(RAISE.length!==15||CURE.length!==10)throw new Error('map '+RAISE.length+' '+CURE.length);
// 1 raise path
L[454]=once(L[454],"const ua=!!(l1&&!UNX_MRUN(cl,l1.q,6));","const ua=!!(l1&&!UNX_MRUN(cl,l1.q,6));let __af=null;if(ua&&!asm){try{__af=__af330(A.map(z=>z.seg).join(' '),unxaCheck.__side,unxaCheck.__R);}catch(e){__af=null;}if(__af&&__af.ok)unxaCheck.__afok=__af;} /* pkgAFF ASK 330 */",'454');
L[455]=once(L[455],"if(ua||asm)return","if((ua&&!(__af&&__af.ok))||asm)return",'455');
L[466]=once(L[466],"const ua=bkcKeep2024(side,j,all,bk?unxaCheck(","unxaCheck.__side=side;unxaCheck.__R=R;unxaCheck.__afok=null;const ua=bkcKeep2024(side,j,all,bk?unxaCheck(",'466a');
L[466]=once(L[466],"PR.filter(p=>p.n===j),text,rk):null); /* pkgBKC */","PR.filter(p=>p.n===j),text,rk):null); /* pkgBKC */if(!ua&&unxaCheck.__afok){marks.push('[AUDIT v55: ASSUMED FACT FORM PASSED (ASK 330, ruling 460) -- '+side+' premise '+j+': '+unxaCheck.__afok.why+'; no K-UNX item; the count stands. Whether the side laid out a chain to that fact is left to the judge\\'s reading; code does not test it. Record-only; not counted in audit_flags.]');} /* pkgAFF */",'466b');
// 2 cure path
const CUREIN="{let __af=null;try{__af=__af330(st,x.side,rounds&&Object.keys(rounds).length?rounds:null);}catch(e){__af=null;}if(__af&&__af.ok)return res('CURED','TRIAL rule (K-UNX, ASK 330, ruling 460): the STATEMENT is in the assumed-fact form: '+__af.why+'; the count stands',['STATEMENT: '+st]);} /* pkgAFF */";
L[1219]=once(L[1219],"if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);","if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);"+CUREIN,'1219');
L[1227]=once(L[1227],"if(x.rule==='K-UNX'){const st=stmtOf(x);","if(x.rule==='K-UNX'){const st=stmtOf(x);"+CUREIN,'1227');
// 2b F1 (W2 6963; W1 6965, W3 6966 agree): the two K-UNX send-backs with no a field ask for the form the cure reader takes
const F1OLD="or, if the step takes for granted a fact no row in the rounds gives, write ASSUMES: <that fact> and quote the block\\'s [L1]; or write";
const F1NEW="or, if the step takes for granted a fact no row in the rounds gives, write the assumed-fact form (ruling 460), three parts in this order, each separated by \" -- \" (a space, two hyphens, a space): STEP: \"<the step\\'s words, quoted exactly from the '+side.toLowerCase()+'\\'s own rounds>\" -- ASSUMES: <one given fact> -- ROWS GIVE: <book chapter:verse> \"<that verse\\'s own words, quoted>\". The ASSUMES must be one fact, not a contested conclusion or an inferred act, and each ROWS GIVE verse must be one cited in the rounds; or write";
L[476]=once(L[476],F1OLD,F1NEW,'476');L[480]=once(L[480],F1OLD,F1NEW,'480');
// 3 new line, added to every node that carries either path
const NL=L.length;L.push(fs.readFileSync(__dirname+'/af330.js','utf8').trim());
const TOUCH=[...new Set([...RAISE,...CURE])];for(const k of TOUCH)M[k].p.push(NL);
// 4 map lengths, header
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
// 5 checks: every touched node parses and holds __af330 as a top-level function
for(const k of Object.keys(M)){const s=T.rb(L,M[k]);let ast;try{ast=acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){throw new Error('parse '+k+': '+e.message);}
 if(TOUCH.includes(k)&&!ast.body.some(x=>x.type==='FunctionDeclaration'&&x.id.name==='__af330'))throw new Error('no top-level __af330 in '+k);}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('touched nodes',TOUCH.length,'MAP lengths changed',ch.length,'lines',L.length,'lib sha',lsha,'node sha',cr.createHash('sha256').update(sl.parameters.jsCode).digest('hex').slice(0,12));
