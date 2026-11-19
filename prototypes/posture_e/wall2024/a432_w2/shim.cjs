// W2 local stand-in for the PostgREST reads of the L2 chain, from SQL dumps (REST host is blocked in this container).
const fs=require('fs');
const OW=JSON.parse(fs.readFileSync(__dirname+'/ow.json')).map(([book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph],i)=>({book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph,_r:i}));
const owBy={};for(const r of OW)(owBy[r.book+'|'+r.chapter+'|'+r.verse]=owBy[r.book+'|'+r.chapter+'|'+r.verse]||[]).push(r);
let LX=null;try{LX=JSON.parse(fs.readFileSync(__dirname+'/lex.json'));}catch(e){}
const pick=(r,sel)=>{const o={};for(const c of sel)o[c]=r[c];return o;};
function get(url){const u=new URL(url);const tbl=u.pathname.split('/').pop();const q=u.searchParams;const sel=(q.get('select')||'').split(',');
 if(tbl==='original_words'){if(q.get('id')==='eq.-1')return [];const o=q.get('or');let rows=[];
  for(const m of o.matchAll(/and\(book\.eq\."([^"]+)",chapter\.eq\.(\d+),verse\.in\.\(([\d,]+)\)\)/g))for(const v of m[3].split(','))rows.push(...(owBy[m[1]+'|'+m[2]+'|'+v]||[]));
  const seen=new Set();rows=rows.filter(r=>!seen.has(r._r)&&seen.add(r._r)).sort((a,b)=>a._r-b._r);if(q.get('order')!=='book,chapter,verse,word_position')throw new Error('order '+q.get('order'));
  return rows.slice(0,+(q.get('limit')||1e9)).map(r=>pick(r,sel));}
 if(tbl==='lexicon_words'){if(!LX)return undefined;return LX.get(url);}
 throw new Error('table '+tbl);}
module.exports={get,setLex:x=>{LX=x;}};
