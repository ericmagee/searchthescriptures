// lenient reasoning for the 6 rows whose stored JSON does not parse: text from "reasoning": to the next top-level key or last }
module.exports=raw=>{const s=String(raw||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');try{const o=JSON.parse(s.slice(a,b+1));return {ok:true,r:String(o.reasoning||o.reason||'')};}catch(e){}
 const k=s.search(/"reason(?:ing)?"\s*:\s*"/);if(k<0)return null;const st=s.indexOf('"',s.indexOf(':',k))+1;
 const nx=s.slice(st).search(/"\s*,\s*\n?\s*"[a-z_]+"\s*:|"\s*\}\s*(?:\[|$)/);const body=nx<0?s.slice(st,b):s.slice(st,st+nx);
 return {ok:false,r:body.replace(/\\n/g,'\n').replace(/\\"/g,'"')};};
