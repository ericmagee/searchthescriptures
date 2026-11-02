// Runs the citation-check chain offline: Citation Scan -> (Cited Verses, emulated from data/kjv_rows.json by the URL's own conditions)
// -> Quote Compare -> (Find Words, emulated from data/kjv_find.json by the URL's own conditions) -> Quote Report. Base or new code.
const fs=require('fs');const D=__dirname+'/../';
const code=(v,n)=>fs.readFileSync(D+v+'/'+n+'.js','utf8');
const rows=()=>{try{return JSON.parse(fs.readFileSync(D+'data/kjv_rows.json','utf8'));}catch(e){return [];}};
const finds=()=>{try{return JSON.parse(fs.readFileSync(D+'data/kjv_find.json','utf8'));}catch(e){return [];}};
function conds(url){const m=url.match(/[?&]or=([^&]+)/);if(!m)return [];const s=decodeURIComponent(m[1]).slice(1,-1);const out=[];let d=0,st=0;for(let i=0;i<s.length;i++){if(s[i]==='(')d++;else if(s[i]===')')d--;else if(s[i]===','&&d===0){out.push(s.slice(st,i));st=i+1;}}out.push(s.slice(st));return out;}
function cited(url){const R=rows();const C=conds(url).map(c=>{const b=c.match(/book\.eq\."([^"]+)"/)[1],ch=+c.match(/chapter\.eq\.(\d+)/)[1];const inm=c.match(/verse\.in\.\(([^)]*)\)/);const g=c.match(/verse\.gte\.(\d+)/),l=c.match(/verse\.lte\.(\d+)/);
 return r=>r.book===b&&r.chapter===ch&&(inm?inm[1].split(',').map(Number).includes(r.verse):(r.verse>=+g[1]&&r.verse<=+l[1]));});return R.filter(r=>C.some(f=>f(r)));}
function found(url){const R=finds();const C=conds(url).map(c=>{const b=c.match(/book\.eq\."([^"]+)"/)[1];const pat=c.match(/text\.ilike\.(.*)\)$/)[1];const re=new RegExp('^'+pat.split('*').map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$','is');return r=>r.book===b&&re.test(r.text);});return R.filter(r=>C.some(f=>f(r)));}
function run(v,r){const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};const st={};
 const $=nm=>{if(nm==='Regrade Load')return {isExecuted:false};if(nm==='Final Output')return {first:()=>({json:F})};
  if(nm==='Citation Scan')return {first:()=>({json:st.cs})};if(nm==='Cited Verses')return {all:()=>cited(st.cs.url_cited).map(j=>({json:j}))};
  if(nm==='Quote Compare')return {first:()=>({json:st.qc})};if(nm==='Find Words')return {all:()=>found(st.qc.url_find).map(j=>({json:j}))};throw new Error(nm);};
 st.cs=new Function('$',code(v,'Citation Scan'))($)[0].json;st.qc=new Function('$',code(v,'Quote Compare'))($)[0].json;const qr=new Function('$',require('fs').readFileSync(D+'data/live_code/Quote Report.js','utf8'))($)[0].json;
 return {scan:st.cs,compare:st.qc,report:qr};}
module.exports={run,conds};
