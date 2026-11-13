// pkgGKV ground reader (offline model of the check). Reads the GROUND of a collision or FORCED line and returns each
// "<REF> "<quote>"" item with whether the quote is a run of words of that verse in the KJV row served this run.
const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
const NW=s=>String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[\[\]]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim();
function items(line){const t=String(line||'').replace(/\\+"/g,'"');const g=t.match(/GROUND\s*:\s*([\s\S]*)$/i);if(!g)return [];const out=[];
 for(const seg of g[1].split(/\s\|\s/)){const re=new RegExp(REF.source+'[\\s,:]{0,4}[“"]([^“”"]{4,600})[”"]','g');let m;
  while((m=re.exec(seg))){out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:m[5],ref:m[1]+' '+m[2]+':'+m[3]+(m[4]?'-'+m[4]:'')});}}
 return out;}
function check(line,rows){const idx={};for(const r of rows)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;const res=[];
 for(const it of items(line)){const parts=[];for(let v=it.v1;v<=it.v2;v++){const x=idx[it.book+' '+it.ch+':'+v];if(x==null){parts.length=0;break;}parts.push(x);}
  if(!parts.length){res.push({...it,status:'NOT READ'});continue;}
  const V=' '+NW(parts.join(' '))+' ';const pcs=it.q.split(/\.\.\.|…|(?<=[.?!])\s+/).map(NW).filter(s=>s.length>0); /* pieces: split at an ellipsis or a sentence end */
  const ok=pcs.length>0&&pcs.every(s=>V.includes(' '+s+' '));res.push({...it,status:!pcs.length?'TOO SHORT':ok?'KJV':'NOT KJV'});}
 return res;}
module.exports={items,check,NW};
