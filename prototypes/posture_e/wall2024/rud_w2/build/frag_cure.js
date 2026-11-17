 function rudCure(x,reply){if(!x||x.rule!=='K-RUD')return null; /* ASK 354: TRIAL, list only; no status here starts with "retracted", so this rule accepts no withdrawal */
 const id=String(x.pair||'');const kind=String(x.kind||'RESULT');const f=' '+String(x.phrase||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';
 const fd=s=>' '+String(s==null?'':s).toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';
 const L=String(reply||'').split('\n').map(l=>l.replace(/[*_`]+/g,'').trim());const rx=id?new RegExp('^(?:RESTATED\\s*:\\s*)?(?:[-•]\\s*)?'+id.replace(/\s+vs\s+/,'\\s+vs\\.?\\s+')+'\\b[^\\n]*?:\\s*([A-Z][A-Z ]+?)(?:\\s+--|$)','i'):null;
 const rg=rx?L.map(l=>l.match(rx)).find(m=>m&&!/^UNDERDETERMINED$/i.test(m[1].trim())):null;
 if(rg)return {st:'CURED',why:'TRIAL rule (K-RUD, list only): the reply grades '+id+' '+rg[1].trim()+'; recorded only',line:String(rg.input).slice(0,1500)};
 const rk=L.find(l=>new RegExp('^(?:RESTATED\\s*:\\s*)?'+kind+'\\s*:','i').test(l)&&!fd(l).includes(f));
 if(rk)return {st:'CURED',why:'TRIAL rule (K-RUD, list only): the reply writes the '+kind+' again without "'+String(x.phrase||'')+'"; recorded only',line:rk.slice(0,1500)};
 const nh=L.find(l=>/\bNOT HELD\b/i.test(l)&&(!id||new RegExp(id.replace(/\s+vs\s+/,'\\s+vs\\.?\\s+'),'i').test(l)||/K-RUD/i.test(l)));
 if(nh)return {st:'CURED',why:'TRIAL rule (K-RUD, list only): NOT HELD with a reason; recorded only',line:nh.slice(0,1500)};
 return {st:'UNCURED',why:'TRIAL rule (recorded and answered; it removes no seat; list only): the reply neither regrades '+id+' nor writes the '+kind+' again without "'+String(x.phrase||'')+'", and writes no NOT HELD',line:null};}
