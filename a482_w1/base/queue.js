/* ==== Queue tab: current Any vs Any (ORACLE_DEBATE_V1) debates. Replaces the old debate_queue view in patch-base.js, which is obsolete (operator fix 2026-10-17).
   A dashboard launch shows RUNNING until its result row lands; REFUSED if the flow refused it; NO RESULT if nothing landed within 30 minutes. Runs launched elsewhere appear when they finish. ==== */
renderQueue=function(){
 document.getElementById('ctl').innerHTML='<button class="btn" onclick="loadTab()">Refresh queue</button>';
 return rpc('queue').then(function(d){
  var rows=(d&&d.rows)||[];
  var h='<div class="ovgrid"><div class="kpi"><div class="n">'+esc((d&&d.running)||0)+'</div><div class="l">Running</div></div><div class="kpi"><div class="n">'+esc((d&&d.finished_24h)||0)+'</div><div class="l">Finished, last 24 h</div></div></div>';
  h+='<p class="stamp">Current Any vs Any debates, newest first. A launch from this dashboard shows RUNNING until its result lands (about 12 to 14 minutes); REFUSED if the flow refused it; NO RESULT if nothing landed within 30 minutes. Runs launched elsewhere appear when they finish. Tap a finished run to open it.</p>';
  if(!rows.length){listHTML(h+empty());return;}
  h+='<div class="card">'+rows.map(function(r){
   var st=String(r.status||'').toUpperCase();
   var cls=st==='COMPLETE'?'t-green':(st==='RUNNING'?'t-blue':'t-red');
   var lab=st==='FAILED'?'NO RESULT':st;
   var click=r.result_id?' onclick="odOpen(\''+r.result_id+'\')"':'';
   return '<div class="item"'+click+'><div class="g"><span class="ttl">'+esc(r.topic||'')+'</span><span class="sub">'+esc(r.sides||'')+' &middot; '+esc(r.submitted_at||'')+(r.verdict?' &middot; Panel: '+esc(r.verdict):'')+'</span></div><span class="tag '+cls+'">'+esc(lab)+'</span>'+(r.result_id?'<span class="chev">&rsaquo;</span>':'')+'</div>';
  }).join('')+'</div>';
  listHTML(h);
 }).catch(fail);
};
/* ==== end Queue tab ==== */
