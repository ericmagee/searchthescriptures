// ASK 328 build: USAGE line on a failed alternate's reply_error (Wall 6879). Shared Library only. Input: target_325 (330+331+325 stacked).
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'../a325b/target_325.json',OUT=process.argv[3]||'target_328.json';
const d=JSON.parse(fs.readFileSync(IN));const U=T.unpack(d);const L=U.L,M=U.M;
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const has=(k,i)=>M[k].p.some(e=>typeof e==='number'?e===i:(typeof e[0]==='number'&&e[0]<=i&&i<=e[1]));
const PAY=Object.keys(M).filter(k=>has(k,2434)),MRG=Object.keys(M).filter(k=>has(k,1633));
if(PAY.join()!=='Alternate Payloads,R2 Alternate Payloads'||MRG.join()!=='Alternate Merge Seat,R2 Alternate Merge Seat')throw new Error('users '+PAY+' / '+MRG);
// 1 payloads: on a failed call keep why as it is, and add usage_line beside it
L[2434]=once(L[2434]," catch(e){res.why=String(e.message||e).replace(/^FAIL-CLOSED:\\s*/,'').slice(0,300);}"," catch(e){res.why=String(e.message||e).replace(/^FAIL-CLOSED:\\s*/,'').slice(0,300);try{res.usage_line=__use328(raw,a);}catch(e2){res.usage_line=null;}} /* pkgUSE ASK 328 */",'2434');
// 2 merge seat: the alternate_reply row's reply_error ends with that line (the ALTERNATE TRIED why is unchanged)
L[1633]=once(L[1633],"reply_error:r.ok?null:String(r.why||''),","reply_error:r.ok?null:String(r.why||'')+(r.usage_line?'\\n'+r.usage_line:''),",'1633');
const NL=L.length;L.push(fs.readFileSync(__dirname+'/use328.js','utf8').trim());for(const k of PAY)M[k].p.push(NL);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
for(const k of Object.keys(M)){const s=T.rb(L,M[k]);let ast;try{ast=acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){throw new Error('parse '+k+': '+e.message);}
 if(PAY.includes(k)&&!ast.body.some(x=>x.type==='FunctionDeclaration'&&x.id.name==='__use328'))throw new Error('no top-level __use328 in '+k);}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('MAP lengths changed',ch.join(', '),'| lines',L.length,'lib sha',lsha);
