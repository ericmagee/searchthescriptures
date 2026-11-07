// pkgKG1L end to end on 33442 chatgpt: Gate Build (patched) feeds Gate Record (patched), with chatgpt's saved live gate reply.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const rd=f=>fs.readFileSync(f,'utf8');const F='/mnt/project-files/wall2024/fetchback_live_s48.json';
const R=process.argv[2]||'33442';
(async()=>{const run=async(node,dir,over)=>{try{return await harness(R,over)('return (async()=>{'+rd(dir+node.replace(/ /g,'_')+'.js')+'\n})()',(node==='Gate Record'?'Gate Call openrouter':feeder(F,node)[0]));}catch(e){return 'ERR '+e.message;}};
 const gbA=await run('Gate Build','pkgKG1L/base_v10/'),gbB=await run('Gate Build','pkgKG1L/patched/');
 const grA=await run('Gate Record','pkgKG1L/base_v10/',{'Gate Build':gbA}),grB=await run('Gate Record','pkgKG1L/patched/',{'Gate Build':gbB});
 const sv=JSON.parse(rd('/mnt/project-files/wall2024/inputs/'+R+'_Gate_Record.json'));const svi=(sv[0]||sv).data.main[0].map(i=>({json:i.json}));
 console.log('base Gate Record equals saved live output:',JSON.stringify(grA)===JSON.stringify(svi));
 const show=(o,tag)=>{const s=JSON.stringify(o);for(const m of s.matchAll(/"gid":"G\d+"[^{}]{0,40}"cured":(true|false)[^{}]{0,600}/g))console.log(tag,m[0].slice(0,700));const k=s.match(/pkgKG1L ORACLE CONCEDE[^\]]*\]/);if(k)console.log(tag,'NOTE',k[0].slice(0,400));const d=s.match(/"drv_uncured":\d+/g);console.log(tag,'drv_uncured',d&&d.join(' '));};
 show(grA,'BASE');show(grB,'KG1L');
 const j=o=>(o&&o[0]&&o[0].json)||{};console.log('keys',Object.keys(j(grB)).join(','));
 const rows=o=>{const out=[];const walk=(v)=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'){if(v.rule==='E-GATE'||v.rule==='E-APPLY')out.push(v);Object.values(v).forEach(walk);}};walk(j(o));return out;};
 const pr=(o,tag)=>{for(const r of rows(o))if(r.seat==='chatgpt')console.log(tag,r.rule,'|',String(r.item||'').slice(0,60),'|',String(r.flagged_line||'').slice(0,120),'|',String(r.cure_status||''),'|',String(r.cure_reason||'').slice(-700));};
 pr(grA,'BASE');pr(grB,'KG1L');
 const sv2=svi;pr(sv2,'LIVE');for(const [t,o] of [['BASE',grA],['KG1L',grB],['LIVE',svi]]){const g=j(o).gate;console.log(t,'gate',JSON.stringify(g).replace(/"(prompt|reply|text|raw)[^,]{200,}/g,'').slice(0,900));}
 for(const [t,o] of [['BASE',grA],['KG1L',grB],['LIVE',svi]]){const s=JSON.stringify(j(o).summary||j(o).substitution||'');console.log(t,'summary',s.slice(0,600));}})();
;(async()=>{})();
