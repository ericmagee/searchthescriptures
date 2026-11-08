// Proof on LIVE s57 code (fetchback_live_s57) of the DeepSeek Enforcer Record read paths that live runs have not exercised:
// EGL v2 (one G<k> line for a same-form item), EGA ("G<k>/A<k>.<n>" lines), EGP (one G<k> line per answer). Saved replies: 33497, 33506.
// Each path must fire, and every answer it fills must carry the verdict DeepSeek wrote on the line that fills it. Also: ERF retryOnFail off, ESH present.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const {harness}=require('../pkgGSL/harness.cjs');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s57.json','utf8'));const N=n=>W.nodes.find(z=>z.name===n);const D='/mnt/project-files/wall2024/inputs/';
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const ER=N('Enforcer Record').parameters.jsCode,EB=N('Enforcer Build').parameters.jsCode;
T(h(ER)===JSON.parse(fs.readFileSync('pkgEGP/plan_EGP.json','utf8')).nodes['Enforcer Record'].patched,'live s57 Enforcer Record is pkgEGP patched ('+h(ER)+'), which contains pkgEGA and pkgEGL v2');
T(/pkgESH/.test(EB)&&/pkgEKG/.test(EB),'live s57 Enforcer Build carries pkgESH and pkgEKG ('+h(EB)+')');
for(const n of ['Judge Enforcer Call deepseek','Alt Judge Enforcer Call deepseek'])T(N(n).retryOnFail!==true,'live s57 '+n+': retryOnFail '+String(N(n).retryOnFail)+' (pkgERF)');
const vd=r=>(String(r.cure_reason||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER|NO VERDICT)/)||[])[1];
for(const R of ['33497','33506']){const o=harness(R)(ER,'Enforcer Call deepseek');const rows=o[0].json.enf421_rows;const ids=JSON.parse(fs.readFileSync(D+R+'_Enforcer_Build.json','utf8'))[0].data.main[0][0].json.ids;
 const rep=String(rows[0].full_reply).split('\n').map(l=>l.replace(/[*_`]+/g,'').trim());
 const ga=rep.map(l=>l.match(/^ENFORCER\s*:\s*G(\d+)\s*\/\s*(A\d+\.\d+)\s*--\s*(AGREE|DISAGREE|NO ANSWER)/i)).filter(Boolean);
 const gl={};rep.forEach(l=>{const m=l.match(/^ENFORCER\s*:\s*G(\d+)\s*--\s*(AGREE|DISAGREE|NO ANSWER)/i);if(m)(gl[m[1]]=gl[m[1]]||[]).push(m[2].toUpperCase());});
 let egl=0,eglOk=0,egp=0,egpOk=0,ega=0,egaOk=0;
 rows.forEach((r,i)=>{const id=ids[i].id,k=id.match(/^A(\d+)\.(\d+)$/);const why=String(r.cure_reason);
  if(/pkgEGL: the enforcer answered item/.test(why)){egl++;if(gl[k[1]]&&gl[k[1]][0]===vd(r))eglOk++;}
  else if(/pkgEGP: item/.test(why)){egp++;if(gl[k[1]]&&gl[k[1]][+k[2]-1]===vd(r))egpOk++;}
  else{const m=ga.find(g=>g[2].toUpperCase()===id.toUpperCase());if(m){ega++;if(m[3].toUpperCase()===vd(r))egaOk++;}}});
 const nv=rows.filter(r=>vd(r)==='NO VERDICT').length;
 out.push('   '+R+': '+rows.length+' answers; EGL v2 '+egl+', EGP '+egp+', EGA '+ega+'; NO VERDICT '+nv);
 if(R==='33497'){T(egl>0&&egl===eglOk,'33497 EGL v2 fired: '+egl+' answers take the single G<k> line of their same-form item ('+eglOk+' match)');T(egp>0&&egp===egpOk,'33497 EGP fired: '+egp+' answers take the G<k> line in their place ('+egpOk+' match)');}
 else T(ega>0&&ega===egaOk,'33506 EGA fired: '+ega+' answers read from "G<k>/A<k>.<n>" lines ('+egaOk+' match)');
 T(nv===0,R+': NO VERDICT 0 on live s57 code');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgPROOF/record_paths_on_s57.txt',out.join('\n')+'\n');
