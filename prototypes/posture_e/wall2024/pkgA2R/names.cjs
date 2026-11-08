// pkgA2R: the round-1 chain and the R2 name substitution, shared by build_A2R.cjs and test_A2R.cjs.
function names(CONN){const CHAIN=[];const st=['Alternate Needed?'];while(st.length){const x=st.shift();if(CHAIN.includes(x)||x==='Dry?')continue;CHAIN.push(x);for(const br of ((CONN[x]||{}).main||[]))for(const c of (br||[]))st.push(c.node);}
 const NAMES=[...CHAIN].sort((a,b)=>b.length-a.length);const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const ALT=NAMES.map(esc).join('|');
 const sub=t=>t.replace(new RegExp('([\'"])('+ALT+')\\1','g'),(m,q,n)=>q+'R2 '+n+q);
 const unsub=t=>t.replace(new RegExp('([\'"])R2 ('+ALT+')\\1','g'),(m,q,n)=>q+n+q);
 const left=t=>(t.match(new RegExp('([\'"])('+ALT+')\\1','g'))||[]);
 return {CHAIN,sub,unsub,left};}
// R2 Alternate Build: three patches on top of the substitution (documented; test_A2R checks they are the only other change).
const AB_PATCH=[
 ["const pool=(RS.alternates||[]);const deb=(RS.debaters||[]);",
  "const pool=(RS.alternates||[]);const deb=(RS.debaters||[]);const __A2R=(PP&&PP.a2r&&PP.a2r.run===true)?PP.a2r:null; /* pkgA2R: round 2 offers only the seats Second Alternate? names, and never a model tried in round 1 */"],
 ["pay.forEach((p,i)=>{if(!QA&&!((p.drv_uncured||0)>0))return;",
  "pay.forEach((p,i)=>{if(!QA&&!((p.drv_uncured||0)>0))return;if(__A2R&&(__A2R.seats||[]).indexOf(p.judge_seat)<0)return; /* pkgA2R */"],
 ["  if(!QA&&used.indexOf(a.api_model)>=0)return 'G4: ",
  "  if(__A2R&&(__A2R.tried||[]).indexOf(a.api_model)>=0)return 'G5 (pkgA2R): '+a.api_model+' was tried in the first alternate round'; /* pkgA2R */\n  if(!QA&&used.indexOf(a.api_model)>=0)return 'G4: "]];
module.exports={names,AB_PATCH};
