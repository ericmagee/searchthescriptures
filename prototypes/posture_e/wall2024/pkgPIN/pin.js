const PIN=(()=>{ /* pkgPIN, ASK 298 (Wall 6433 item 10): a press in the premise list that writes PROVEN IN [<round>] must name a round, not later than this one, that names its verse with its reference; when it does not, the round goes back once with the round(s) that do. Case: 37113 DR2 Luke 2:33, Luke 2:41, Acts 2:30 marked PROVEN IN [CR1], found only in DR1. */
 const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const REF=/((?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\s(\d{1,3}):(\d{1,3})/g;
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const has=(t,b,c,v)=>new RegExp('(?:^|[^A-Za-z])'+esc(b).replace(/\s+/g,'\\s+')+'\\s+'+c+':'+v+'(?![0-9])').test(String(t||''));
 function check(own,round,R){const out=[];const seen=new Set();const L=String(own||'').split('\n');
  for(const l0 of L){const l=l0.replace(/[*_`]+/g,'');const pm=l.match(/PROVEN IN\s*\[\s*([CD]R[1-4])\s*\]/i);if(!pm)continue;const rk=pm[1].toUpperCase();
   const rm=[...l.matchAll(REF)][0];if(!rm)continue;const ref=rm[1]+' '+rm[2]+':'+rm[3];if(seen.has(ref+'|'+rk))continue;seen.add(ref+'|'+rk);
   const later=ORD.indexOf(rk)>ORD.indexOf(round);const t=R[rk];if(!later&&typeof t==='string'&&has(t,rm[1],rm[2],rm[3]))continue;
   const alt=ORD.filter(k=>ORD.indexOf(k)<=ORD.indexOf(round)&&k!==round&&typeof R[k]==='string'&&has(R[k],rm[1],rm[2],rm[3]));
   out.push({ref,rk,why:later?'a round after this one':typeof t!=='string'?'no such round':'that round does not name '+ref,alt,line:l.trim().slice(0,300)});}
  return out;}
 function note(p){return "PROVEN IN CHECK -- computed by the system from your round, not by a model. Each press below writes PROVEN IN [<round>], but that round does not name the verse with its reference, so the press is UNPROVEN as written. "
  +"In the round you return, write each of these presses again with PROVEN IN naming a round that quotes the verse with its reference (the system found it in the round(s) named), or give the press its own [L2] or [L3] in place. Change nothing else for this check. The presses:\n"
  +p.map((x,i)=>'P'+(i+1)+' '+x.ref+' -- PROVEN IN ['+x.rk+']: '+x.why+(x.alt.length?'; it is named in ['+x.alt.join('], [')+']':'; no earlier round names it, so give it its own layer')).join('\n');}
 return {check,note};})();
