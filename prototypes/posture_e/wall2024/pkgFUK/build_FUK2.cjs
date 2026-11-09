// pkgFUK rev 2 (W1; coordinator 23:27Z 11-09: W3's reader gaps A, B, C from Wall 3809, folded into pkgFUK). Base: strip_FUK (rev 1) on live s90; library otherwise s89/s90.
//  A. K-S3 reader: "NOT COUNTED" read CURED, because the word COUNTED alone was tested. Now a COUNTED with not/never/no/nor/n't in the 3 words before it is not COUNTED.  (cureVerdicts; 26 library files)
//  B. a RESPONSE line with nothing after the bar is UNCURED ("no written response", not silent) and was never asked. fumAsk2024 now asks it once, labelled NO ANSWER. (6 Normalize files)
//  C. a corrected count is never written for K-S3: (C1) fumKeep2024 keeps a follow-up CORRECTED COUNT line for the side of an asked K-S3 item, and fumJoin2024 lets it
//     replace that side's first-reply count; if keeping it changes an unasked item, the follow-up is kept without the count line (rev 7 guard) and fum.count_dropped says so.
//     (C2) cureSet writes the side's single CORRECTED COUNT when a K-S3 item is CURED as COUNTED (it listed K-G/K-P/K-V/K-LB/K-UNX items only). (26 library files)
//   node pkgFUK/build_FUK2.cjs strip   -> pkgLIB/strip_FUK2, pkgFUK/plan_FUK2.json
//   FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_FUK2 pkgLIB_FUK2
//   node pkgFUK/build_FUK2.cjs parent  -> pkgFUK/parent_s90_FUK2.json
const fs=require('fs'),path=require('path'),cr=require('crypto');const W=path.resolve(__dirname,'..');
const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const sub=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)die(what+': '+n+' hits for '+JSON.stringify(a.slice(0,90)));return s.split(a).join(b);};
const BASE='strip_FUK',STRIP='strip_FUK2',LIBP='pkgLIB_FUK2',NODES=418;const mode=process.argv[2];
const NORM=['Alternate_Cure_Normalize.js','Cure_Normalize.js','Panel_Cure_Normalize_1.js','Panel_Cure_Normalize_2.js','Panel_Cure_Normalize_3.js','R2_Alternate_Cure_Normalize.js'];
// A
const A0=String.raw`if(/\bCOUNTED\b/.test(rp))return res('CURED','answered: the close concession is counted',[rp]);`;
const A1=String.raw`if([...rp.matchAll(/\bCOUNTED\b/g)].some(m=>!/(?:^|\s)(?:not|never|no|nor|\S*n['’]t)\s+(?:\S+\s+){0,2}$/i.test(rp.slice(0,m.index))))return res('CURED','answered: the close concession is counted',[rp]); /* pkgFUK rev 2 A (W3 3809): NOT COUNTED is not COUNTED */`;
// C2
const C20=String.raw`(x.rule==='K-UNX'&&x.status==='CURED'&&/CORRECTED COUNT \d+ takes the premise out/.test(String(x.why||'')))));`;
const C21=String.raw`(x.rule==='K-UNX'&&x.status==='CURED'&&/CORRECTED COUNT \d+ takes the premise out/.test(String(x.why||'')))||(x.rule==='K-S3'&&x.status==='CURED'&&/^answered: the close concession is counted/.test(String(x.why||''))))); /* pkgFUK rev 2 C2 (W3 3809): a K-S3 item answered COUNTED writes the side's corrected count */`;
// B
const B0=String.raw` if(!miss.length&&!noq.length&&!ks3.length)return null;`;
const B1=String.raw` const emp=v.filter(x=>x.status!=='CURED'&&/^no written response(?:;|$)/.test(String(x.why||''))&&!x.silent&&!miss.includes(x)&&(()=>{try{const own=cureLines(reply.text).malformed.filter(l=>cureOwn(l,x));return own.length>0&&own.every(l=>/\|$/.test(String(l).replace(/[*\x60_]+/g,'').trim()));}catch(e){return false;}})()); /* pkgFUK rev 2 B (W3 3809): a RESPONSE line with nothing after the bar */
 if(!miss.length&&!noq.length&&!ks3.length&&!emp.length)return null;`;
const B2a=String.raw` if(ks3.length)P.push(`;
const B2b=String.raw` if(emp.length)P.push('','Items whose RESPONSE line has nothing after the bar ('+emp.length+'):',...emp.map(x=>'- '+lab(x)),'For each, write: RESPONSE: <the item, as labelled above> | <your answer>, in the form the request above gives for its rule.'); /* pkgFUK rev 2 B */
 if(ks3.length)P.push(`;
const B3a="ks3.map(x=>'NO REASON '+lab(x))),items:miss.concat(noq,ks3).map(";
const B3b="ks3.map(x=>'NO REASON '+lab(x)),emp.map(x=>'NO ANSWER '+lab(x))),items:miss.concat(noq,ks3,emp).map(";
const B4a="&&!noq.includes(x)&&!ks3.includes(x))";const B4b="&&!noq.includes(x)&&!ks3.includes(x)&&!emp.includes(x))";
// C1 fumKeep
const K0=String.raw`const KR=(items||[]).filter(x=>x&&x.rule==='K-RUL');const out=[];let card=0;`;
const K1=String.raw`const KR=(items||[]).filter(x=>x&&x.rule==='K-RUL');const out=[];let card=0;const KS3=new Set((items||[]).filter(x=>x&&x.rule==='K-S3').map(x=>String(x.side||'').toUpperCase())); /* pkgFUK rev 2 C1 */`;
const K2a="  const U=l.toUpperCase().replace(/\\s+/g,' ');const m=U.match(/^(RESPONSE|STATEMENT)\\s*:\\s*([^|]*)\\|/);";
const K2b=String.raw`  if(KS3.size){const cc=l.match(/^CORRECTED\s+COUNT\s*:\s*(DEFENDER|CHALLENGER)\s+\d+/i);if(cc&&KS3.has(cc[1].toUpperCase())){out.push(l);continue;}} /* pkgFUK rev 2 C1 (W3 3809): the corrected count asked of a K-S3 item is kept */
`+K2a;
// C1 fumJoin (whole function)
const J0=String.raw`function fumJoin2024(r1,r2,items,others,src){if(!r1||!r1.ok)return r1||r2||{ok:false,text:null,why:'no reply'};if(!r2||!r2.ok)return Object.assign({},r1,{fum:{ok:false,why:r2?String(r2.why||'no reply'):'no reply'}});
 const k=fumKeep2024(String(cureUnwrap(r2.text)),items,others);const J=Object.assign({},r1,{text:(k?k+'\n\n':'')+String(cureUnwrap(r1.text)),fum:{ok:true,finish:r2.finish||null,kept:k?k.split('\n').length:0}});
 /* pkgFUM rev 7 guard: the whole build is read with and without the follow-up; if any item that was NOT asked reads differently, the follow-up is dropped and the first reply stands */
 try{if(src&&Array.isArray(src.items)&&src.items.length){const A=new Set((items||[]).map(x=>x.rule+'|'+x.side+'|'+x.link));const v0=cureVerdicts(src.items,r1,src.broken,src.rounds),v1=cureVerdicts(src.items,J,src.broken,src.rounds);
  const ch=src.items.map((x,i)=>(!A.has(x.rule+'|'+(x.side||null)+'|'+(x.link==null?null:x.link))&&(v0[i].status!==v1[i].status||String(v0[i].why)!==String(v1[i].why)))?x.rule+' '+x.link:null).filter(Boolean);
  if(ch.length)return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: it changed unasked item(s): '+ch.join('; ').slice(0,300)}});}}catch(e){return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: guard error '+String(e&&e.message||e).slice(0,120)}});}
 return J;}`;
const J1=String.raw`function fumJoin2024(r1,r2,items,others,src){if(!r1||!r1.ok)return r1||r2||{ok:false,text:null,why:'no reply'};if(!r2||!r2.ok)return Object.assign({},r1,{fum:{ok:false,why:r2?String(r2.why||'no reply'):'no reply'}});
 const k=fumKeep2024(String(cureUnwrap(r2.text)),items,others);
 /* pkgFUK rev 2 C1: a kept CORRECTED COUNT line replaces the first reply's count line of the same side */
 const CC=/^\s*(?:[-*•>]\s*)?\**\s*CORRECTED\s+COUNT\s*\**\s*:\s*\**\s*(DEFENDER|CHALLENGER)\b/i;
 const mk=kk=>{const sd=new Set(String(kk).split('\n').map(l=>(l.match(CC)||[])[1]).filter(Boolean).map(s=>s.toUpperCase()));const t1=sd.size?String(cureUnwrap(r1.text)).split('\n').filter(l=>{const m=l.replace(/\x60/g,'').match(CC);return !(m&&sd.has(m[1].toUpperCase()));}).join('\n'):String(cureUnwrap(r1.text));
  return Object.assign({},r1,{text:(kk?kk+'\n\n':'')+t1,fum:{ok:true,finish:r2.finish||null,kept:kk?kk.split('\n').length:0}});};
 const J=mk(k);
 /* pkgFUM rev 7 guard: the whole build is read with and without the follow-up; if any item that was NOT asked reads differently, the follow-up is dropped and the first reply stands */
 try{if(src&&Array.isArray(src.items)&&src.items.length){const A=new Set((items||[]).map(x=>x.rule+'|'+x.side+'|'+x.link));const v0=cureVerdicts(src.items,r1,src.broken,src.rounds);
  const chOf=JJ=>{const v1=cureVerdicts(src.items,JJ,src.broken,src.rounds);return src.items.map((x,i)=>(!A.has(x.rule+'|'+(x.side||null)+'|'+(x.link==null?null:x.link))&&(v0[i].status!==v1[i].status||String(v0[i].why)!==String(v1[i].why)))?x.rule+' '+x.link:null).filter(Boolean);};
  const ch=chOf(J);
  if(ch.length){const k1=k.split('\n').filter(l=>!CC.test(l)).join('\n');if(k1!==k){const J1=mk(k1);if(!chOf(J1).length){J1.fum.count_dropped='the follow-up CORRECTED COUNT was not kept: it changed unasked item(s): '+ch.join('; ').slice(0,240);return J1;}} /* pkgFUK rev 2 C1: the count alone is dropped, the asked lines stand */
   return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: it changed unasked item(s): '+ch.join('; ').slice(0,300)}});}}}catch(e){return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: guard error '+String(e&&e.message||e).slice(0,120)}});}
 return J;}`;
if(mode==='strip'){
 const A=W+'/pkgLIB/'+BASE,B=W+'/pkgLIB/'+STRIP;if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});const plan={base:'pkgLIB/'+BASE,library:{}};
 for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(A+'/patched/'+f,'utf8');let s=s0;const did=[];
  if(s.includes("if(x.rule==='K-S3'){const rp=respOf(x)")){s=sub(s,A0,A1,f+' A');did.push('A');}
  if(s.includes('function cureSet(')){s=sub(s,C20,C21,f+' C2');did.push('C2');}
  if(NORM.includes(f)){s=sub(s,B0,B1,f+' B check');s=sub(s,B2a,B2b,f+' B prompt');s=sub(s,B3a,B3b,f+' B asked');s=sub(s,B4a,B4b,f+' B others');s=sub(s,K0,K1,f+' C1 keep set');s=sub(s,K2a,K2b,f+' C1 keep line');s=sub(s,J0,J1,f+' C1 join');did.push('B','C1');}
  else if(s.includes('function fumAsk2024('))die(f+': fumAsk2024 outside the Normalize files');
  new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s),changes:did};}
 const ch=Object.entries(plan.library).filter(e=>e[1].changes.length);
 fs.writeFileSync(__dirname+'/plan_FUK2.json',JSON.stringify(plan,null,1)+'\n');console.log(STRIP+': '+Object.keys(plan.library).length+' files, '+ch.length+' changed: '+ch.map(e=>e[0]+'['+e[1].changes.join(',')+']').join(' '));
}else if(mode==='parent'){
 const FB=process.env.FB||'/mnt/project-files/wall2024/fetchback_live_s90.json';let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const P=W+'/'+LIBP+'/patched';if(!fs.existsSync(P))die('pack first');
 const by={};d.nodes.forEach(n=>by[n.name]=n);if(d.nodes.length!==NODES)die('base has '+d.nodes.length+' nodes, expected '+NODES);const changed=[];
 for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');const n=by[nm];if(!n)die('no node '+nm);const c=fs.readFileSync(P+'/'+f,'utf8');if(n.parameters.jsCode!==c){n.parameters.jsCode=c;changed.push(nm);}}
 for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(W+'/'+LIBP+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
 fs.writeFileSync(__dirname+'/parent_s90_FUK2.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
 console.log('parent_s90_FUK2.json: '+d.nodes.length+' nodes; changed '+changed.length+': '+changed.join(', ')+'; connections unchanged');
}else die('mode strip | parent');
