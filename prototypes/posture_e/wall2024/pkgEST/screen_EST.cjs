// pkgEST screen: in each saved run, every K-W / K-S3 cure row (Panel Cure Check enforcer_log) vs that seat's cure reply (Panel Cure Normalize N):
// is the answer form (K-W: STANDS WITHOUT IT / CONCEDED; K-S3: COUNTED / TOUCHES NO LINK) in the RESPONSE line, only in the same item's STATEMENT line, or in neither?
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>JSON.parse(fs.readFileSync(f,'utf8'));const one=f=>{const d=rd(f);const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main||[[]])[0]||[];};
const FORM={'K-W':/^\s*(?:STANDS WITHOUT IT\b|CONCEDED\b)/i,'K-S3':/^\s*(?:COUNTED\b|TOUCHES NO LINK\b)/i};
const clean=s=>String(s||'').replace(/[*_`]+/g,'').trim();
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33\d{3}_Panel_Cure_Check\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();const T={rows:0,resp:0,stmtOnly:0,neither:0};const ex=[];
for(const R of runs){let pcc;try{pcc=one(D+R+'_Panel_Cure_Check.json')[0].json;}catch(e){continue;}const rows=(pcc.enforcer_log||[]).filter(r=>r&&(r.rule==='K-W'||r.rule==='K-S3'));if(!rows.length)continue;
 const rep={};for(const k of [1,2,3]){try{for(const it of one(D+R+'_Panel_Cure_Normalize_'+k+'.json')){const c=it.json&&it.json.cure,r=it.json&&it.json.reply;if(c&&r&&r.text)rep[c.seat]=String(r.text).replace(/\\n/g,'\n').replace(/\\"/g,'"');}}catch(e){}}
 const c={rows:0,resp:0,stmtOnly:0,neither:0};
 for(const r of rows){c.rows++;const resp=clean(r.response_line).replace(/^RESPONSE\s*:\s*/i,'');if(FORM[r.rule].test(resp)){c.resp++;continue;}
  const t=rep[r.seat]||'';const lab=clean(r.item);const st=t.split('\n').map(clean).map(l=>l.replace(/^"(?:reasoning|reason)"\s*:\s*"/,'')).find(l=>{const m=l.match(/^STATEMENT\s*:\s*(K-W|K-S3)\s+(.+?)\s*\|\s*([\s\S]*)$/i);return m&&m[1].toUpperCase()===r.rule&&clean(m[2])===lab;});
  const sv=st?st.replace(/^STATEMENT\s*:\s*(?:K-W|K-S3)\s+.+?\s*\|\s*/i,''):'';
  if(st&&FORM[r.rule].test(sv)){c.stmtOnly++;if(ex.length<6)ex.push(R+' '+r.seat+' '+r.rule+' '+lab+'\n    RESPONSE: '+resp.slice(0,140)+'\n    STATEMENT: '+sv.slice(0,140));}else c.neither++;}
 for(const k in T)T[k]+=c[k];console.log(R,JSON.stringify(c));}
console.log('TOTAL',JSON.stringify(T));ex.forEach(x=>console.log(x));
