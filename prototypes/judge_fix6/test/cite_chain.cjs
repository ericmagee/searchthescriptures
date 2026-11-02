// The citation chain run offline: Citation Scan -> Cited Verses (emulated on data/kjv_<run>.json from the scan's URL) -> Quote Compare
// -> Find Words (emulated: the url_find ilike conditions over the stored rows of the cited chapters only) -> Quote Report.
const fs=require('fs');const R=require('./runner.cjs');const L=require('./libload.cjs');
const KJV=JSON.parse(fs.readFileSync(__dirname+'/../data/kjv_32293.json','utf8'));
function conds(url){const q=decodeURIComponent(url.split('&or=')[1]||'');return q;}
function cited(urls){const out=[];for(const u of urls){const q=conds(u);for(const m of q.matchAll(/and\(book\.eq\."([^"]+)",chapter\.eq\.(\d+),verse\.in\.\(([\d,]+)\)\)/g)){const vs=new Set(m[3].split(',').map(Number));KJV.filter(r=>r.book===m[1]&&r.chapter===+m[2]&&vs.has(r.verse)).forEach(r=>out.push(r));}}return out;}
function find(url){const q=conds(url);const out=[];for(const m of q.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]*)\)/g)){const rx=new RegExp('^'+m[2].split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$','is');KJV.filter(r=>r.book===m[1]&&rx.test(r.text)).forEach(r=>out.push(r));}return out.slice(0,500);}
function chain(v,F){const scan=R.runNode(v,'Citation Scan',{'Final Output':F});const S=scan[0].json;
 const rows=cited(scan.map(x=>x.json.url_cited).filter(Boolean));
 const qc=R.runNode(v,'Quote Compare',{'Citation Scan':scan.map(x=>x.json),'Cited Verses':rows.length?rows:[{}]});const C=qc[0].json;
 const fw=find(C.url_find);const qr=R.runNode(v,'Quote Report',{'Quote Compare':C,'Find Words':fw.length?fw:[{}]});return {S,pages:scan.length,C,Q:qr[0].json};}
module.exports={chain};
if(require.main===module){const v=process.argv[2]||'base';const r=L.run('32293');const F=L.F_(r);const {S,pages,Q}=chain(v,F);
 console.log(v,'scanned',S.scanned,'items',S.items.length,'pages',pages,'| report checked',Q.checked,'matches',Q.matches,'mismatches',Q.mismatches,'not_checked',Q.not_checked,'| stored',JSON.stringify({checked:r.citation_check.checked,matches:r.citation_check.matches,mismatches:r.citation_check.mismatches,not_checked:r.citation_check.not_checked}));
 Q.items.forEach((i,k)=>{if(!/^MATCHES/.test(i.status))console.log(' ',k+1,i.side,i.round,i.ref,'|',i.status,i.reason?'| '+i.reason:'','| "'+String(i.quote).slice(0,80)+'"',i.rebound_from?'rebound from '+i.rebound_from:'');});
 const per={};Q.items.forEach(i=>{const k=i.side+' '+i.round;per[k]=(per[k]||0)+1;});console.log('  per round:',JSON.stringify(per));
 const last=Q.items[Q.items.length-1];console.log('  last item:',last.side,last.round,last.ref);}
