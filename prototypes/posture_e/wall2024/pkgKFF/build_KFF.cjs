// pkgKFF (W1 Wall 2768; W3 ruling Wall 2769): K-FF, a FORCED line's FAILS quotation that is only the words of a KJV verse the answer quotes. TRIAL.
// Base: live s28 (fetchback_live_s28.json = 4f62e6cf: s26 EPK, s27 UNXW2 v2, s28 LOG v2). Every anchor must occur the stated number of times.
// Run from wall2024/: node pkgKFF/build_KFF.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const FB='/mnt/project-files/wall2024/fetchback_live_s28.json';const w=JSON.parse(fs.readFileSync(FB,'utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow.nodes);
const LIB=fs.readFileSync('pkgKFF/kff_lib.js','utf8');
const rep=(s,a,b,f,k)=>{const n=s.split(a).length-1;if(n!==k)throw new Error(f+': anchor x'+n+' (want '+k+'): '+a.slice(0,80));return s.split(a).join(b);};
const FCCALL="{const FC=kfcLines(text,R);FC.items.forEach(x=>items.push(x));FC.marks.forEach(x=>marks.push(x));}";
const FCCURE="if(x.rule==='K-FC'){if(wd.has(U(x.link)))";
const E={
 lib:["function kfcLines(",LIB+"function kfcLines(",1],
 call:[FCCALL,FCCALL+"\n    {const FF=kffLines(text,R);FF.items.forEach(x=>items.push(x));FF.marks.forEach(x=>marks.push(x));} // pkgKFF: K-FF (TRIAL)",1],
 enf:["'K-FC':'TRIAL'","'K-FC':'TRIAL','K-FF':'TRIAL'",1],
 lst:["x.rule==='K-FC'||","x.rule==='K-FC'||x.rule==='K-FF'||",3],
 cure:[FCCURE,
  "// pkgKFF K-FF (TRIAL; W3 2769): cured by RETRACTED for the link, by a RESTATED line not graded LINK BROKEN, or by one FORCED line for the item\n"
 +"  // whose FAILS quotation is not only the words of a verse the answer quotes (kffLines raises nothing on it). No change is refused, no count written.\n"
 +"  if(x.rule==='K-FF'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n"
 +"   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);\n"
 +"   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\\s*)?FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:/i.test(l)&&U(l).replace(/\\s+VS\\.?\\s+/g,' VS ').includes(U(x.link).replace(/\\s+VS\\s+/g,' VS ')));\n"
 +"   if(!fl.length)return res('UNCURED','TRIAL rule (K-FF): no FORCED line for '+x.link+', no RETRACTED line and no RESTATED line regrading it',null);\n"
 +"   const chk=kffLines(fl[0],R);if(chk.items.length)return res('UNCURED','TRIAL rule (K-FF): '+chk.items[0].why,[fl[0]]);\n"
 +"   return res('CURED','TRIAL rule (K-FF): the FORCED line\\'s FAILS quotes the answer\\'s own words'+(chk.report.length?' ('+chk.report[0]+')':''),[fl[0]]);}\n"
 +"  "+FCCURE,1],
 r396:["-- FAILS: \\\"<the words of the layer of that answer that fails to show the fit, quoted from the ANSWER round>\\\" -- CARRIED BY:",
  "-- FAILS: \\\"<the answer's own words that fail to show the fit, quoted from the ANSWER round: its reading, not only the words of a verse it quotes>\\\" -- CARRIED BY:",1],
 r396b:["A MEANS its own verse does not carry is no ground for a forced link.\";",
  "A MEANS its own verse does not carry is no ground for a forced link. FAILS names what in the answer fails, its own reading; a verse does not fail. K-FF, a TRIAL check, returns for cure a FAILS that is only the words of a verse the answer quotes.\";",1]};
const OUT='pkgKFF/patched';fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync('pkgKFF/base',{recursive:true});const plan={ruling:'W3 Wall 2769 (TRIAL)',base:'live s28 4f62e6cf',nodes:[]};
for(const n of NS){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string')continue;const ks=Object.keys(E).filter(k=>s0.includes(E[k][0]));if(!ks.length)continue;
 let s=s0;for(const k of ks){const [a,b,cnt]=E[k];s=rep(s,a,b,n.name+' '+k,cnt);}
 new Function('$','$input','$json','$execution','$workflow',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgKFF/base/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base_sha:sha(s0),final_sha:sha(s),edits:ks});console.log(n.name.padEnd(28),sha(s0),'->',sha(s),ks.join(','));}
fs.writeFileSync('pkgKFF/plan_KFF.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
