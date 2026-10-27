/* ==== TRUTH dashboard additions (Eric-ruled 2026-07-25) ==== */
var LINKS=[['Supabase','https://supabase.com/dashboard/project/bhffmkginddovmdcpnty'],['Vercel','https://vercel.com/truth-app/truth-app-dashboard'],['GitHub','https://github.com/ericmagee/truth-app-backups'],['n8n','https://truthapp.app.n8n.cloud']];
function linksHTML(){return '<div class="tabs" style="margin:0 0 12px">'+LINKS.map(function(l){return '<a class="tab" style="text-decoration:none" target="_blank" rel="noopener" href="'+l[1]+'">'+l[0]+' &nearr;</a>';}).join('')+'</div>';}
function loadDebateList(prefix){return rpc('debates').then(function(rows){var h=(prefix||'');if(rows&&rows.length){h+='<div class="h2">Recent debates</div><div class="card">'+rows.map(function(r){var d=(r.created_at||'').slice(0,16).replace('T',' ');var fv=String(r.framework_verdict||'').toUpperCase();return '<div class="item" onclick="dOpen(\''+r.id+'\')"><div class="g"><span class="ttl">'+esc(r.topic||'')+'</span><span class="sub">Claude defends &middot; '+ccEng(r.engine)+' challenges &middot; '+esc(d)+'</span></div><span class="tag '+(fv==='HELD'?'t-green':(fv==='BROKEN'?'t-red':'t-gold'))+'">FW: '+esc(r.framework_verdict||'?')+'</span><span class="chev">&rsaquo;</span></div>';}).join('')+'</div>';}else{h+=empty();}listHTML(h);return rows;}).catch(fail);}
function dOpen(id){var sh=document.getElementById('sheet');sh.innerHTML='<div class="loading">Loading transcript...</div>';document.getElementById('ov').classList.add('on');rpc('debate_by_id',{p_id:id}).then(function(d){if(!d){sh.innerHTML='<button class="closeb" onclick="closeSheet()">&times;</button><p>Not found.</p>';return;}var eng=ccEng(d.engine);var fv=String(d.framework_verdict||'').toUpperCase();var h='<button class="closeb" onclick="closeSheet()">&times;</button><h3>'+esc(d.topic||'')+'</h3><div class="meta"><span class="tag t-teal">Claude defends</span><span class="tag t-gold">'+esc(eng)+' challenges</span><span class="tag '+(fv==='HELD'?'t-green':(fv==='BROKEN'?'t-red':'t-gold'))+'">FW: '+esc(d.framework_verdict||'')+'</span><span class="tag t-mut">'+esc((d.created_at||'').slice(0,16).replace('T',' '))+'</span></div>';h+=turn('Defender — Claude · R1','who-def',d.claude_r1);h+=turn('Challenger — '+esc(eng)+' · R1','who-cha',d.engine_r1);h+=turn('Defender — Claude · R2','who-def',d.claude_r2);h+=turn('Challenger — '+esc(eng)+' · R2','who-cha',d.engine_r2);if(d.engine_r3)h+=turn('Challenger — '+esc(eng)+' · R3','who-cha',d.engine_r3);h+=turn('Synthesis','who-syn',d.synthesis);h+=turn('Framework verdict','who-syn',d.framework_verdict);h+=turn('Independent verdict','who-syn',d.independent_verdict_raw);sh.innerHTML=h;}).catch(sheetFail);}
function renderQueue(){document.getElementById('ctl').innerHTML='<button class="btn" onclick="loadTab()">Refresh queue</button>';return rpc('queue').then(function(d){var rows=(d&&d.rows)||[];var depth=(d&&d.depth)||0;var cap=(d&&d.cap)||10;var h='<div class="ovgrid"><div class="kpi"><div class="n">'+depth+' / '+cap+'</div><div class="l">Queue depth</div></div></div>';h+='<p class="stamp">A submitted row fires immediately via the debate_queue_auto_fire trigger — pending does not mean waiting. Nothing marks rows complete automatically, so depth only falls when they are cleared. At '+cap+' the Launch button blocks.</p>';if(!rows.length){listHTML(h+empty());return;}h+='<div class="card">'+rows.map(function(r){var st=String(r.status||'').toUpperCase();var cls=(st==='COMPLETE')?'t-green':((st==='FAILED')?'t-red':((st==='RUNNING')?'t-blue':'t-gold'));var sub=ccEng(r.engine)+' &middot; '+(r.rounds||'?')+' rounds &middot; '+String(r.submitted_at||'').slice(0,16).replace('T',' ');return '<div class="item"><div class="g"><span class="ttl">'+esc(r.topic||'')+'</span><span class="sub">'+sub+'</span></div><span class="tag '+cls+'">'+esc(st)+'</span></div>';}).join('')+'</div>';listHTML(h);}).catch(fail);}
renderDebate=function(){document.getElementById('ctl').innerHTML='<input id="dtopic" placeholder="Debate topic" autocomplete="off"><div class="row2"><select id="deng"><option value="deepseek">DeepSeek</option><option value="chatgpt">ChatGPT</option><option value="gemini">Gemini</option><option value="grok">Grok</option></select><select id="drounds"><option value="2">2 rounds</option><option value="3" selected>3 rounds</option><option value="4">4 rounds</option></select></div><button class="btn" id="dbtn" onclick="launchDebate()">Launch debate</button>';return loadDebateList('<p class="stamp">Claude defends the position through the four-layer method; the engine you pick challenges it. Runs on your n8n engine and can take a couple minutes. Saved to debate_results.</p>');};
startPoll=function(){if(window.__dpoll)clearInterval(window.__dpoll);window.__dsince=Date.now();window.__dn=0;window.__dpoll=setInterval(pollDebate,20000);listHTML('<div class="loading">Fired — running the rounds.<br>Checking for the transcript every 20s.</div>');};
pollDebate=function(){window.__dn=(window.__dn||0)+1;rpc('debates').then(function(rows){var want=String(window.__dtopic||'').trim().toLowerCase();var hit=(rows||[]).find(function(r){return String(r.topic||'').trim().toLowerCase()===want&&new Date(r.created_at).getTime()>window.__dsince-60000;});var b=document.getElementById('dbtn');if(hit){if(window.__dpoll){clearInterval(window.__dpoll);window.__dpoll=null;}if(b){b.disabled=false;b.textContent='Launch debate';}dOpen(hit.id);loadDebateList('');}else if(window.__dn>30){if(window.__dpoll){clearInterval(window.__dpoll);window.__dpoll=null;}if(b){b.disabled=false;b.textContent='Launch debate';}showErr('No result after 10 minutes — check n8n executions (see debate_errors).');loadDebateList('');}else{listHTML('<div class="loading">Still running... check '+window.__dn+' of 30<br><span class="stamp">checking every 20s</span></div>');}}).catch(function(e){});};
TABS.splice(5,0,['queue','Queue']);
var __origLoadTab=loadTab;
loadTab=function(){if(cur==='queue'){clrErr();return renderQueue();}var r=__origLoadTab.apply(this,arguments);if(cur==='overview'&&r&&r.then){r.then(function(){var el=document.getElementById('list');if(el)el.insertAdjacentHTML('afterbegin',linksHTML());var map=['sights','sights','guards','tensions','todos','journal'];var els=document.querySelectorAll('#list .ovgrid .kpi');for(var i=0;i<els.length&&i<map.length;i++){(function(e2,t){e2.style.cursor='pointer';e2.onclick=function(){go(t);};})(els[i],map[i]);}});}return r;};
/* ==== end additions ==== */

/* ==== Audit + Blackboard (BB) tabs — Eric-ruled 2026-07-27 ==== */
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='journal'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['audit','Audit'],['bb','BB']);})();
function bbPrio(p){p=String(p||'').toUpperCase();if(p==='CRITICAL')return 't-red';if(p==='HIGH')return 't-gold';if(p==='NORMAL')return 't-blue';return 't-mut';}
function bbStat(s){s=String(s||'').toLowerCase();if(s==='closed'||s==='superseded')return 't-green';if(s==='open')return 't-blue';if(s==='claimed')return 't-violet';if(s==='answered')return 't-gold';return 't-mut';}
function auditCls(t){t=String(t||'');if(t.indexOf('AUTO-DDL')===0)return 't-blue';if(t.indexOf('BLACKBOARD')===0)return 't-violet';if(t.indexOf('GUARD')===0||t.indexOf('GATE ARMOR')===0)return 't-red';if(t.indexOf('buildlog')>-1)return 't-teal';if(t.indexOf('Daily Drive Sync')>-1)return 't-green';return 't-mut';}
function renderAudit(){return rpc('audit',{q:qv(),lim:80}).then(function(rows){window.__audit=rows||[];if(!window.__audit.length){listHTML(empty());return;}listHTML('<div class="card">'+window.__audit.map(function(a){return '<div class="item" onclick="auditOpen('+a.id+')"><div class="g"><span class="ttl">#'+a.id+' '+esc(a.title||'')+'</span><span class="sub">'+esc(a.cdt||'')+(a.engine?(' &middot; '+esc(a.engine)):'')+'</span></div><span class="tag '+auditCls(a.title)+'">'+esc(String(a.title||'log').split(/[\s:—]/)[0].slice(0,10))+'</span><span class="chev">&rsaquo;</span></div>';}).join('')+'</div>');}).catch(fail);}
function auditOpen(id){var a=(window.__audit||[]).find(function(x){return x.id===id;})||{};var sh=document.getElementById('sheet');sh.innerHTML='<button class="closeb" onclick="closeSheet()">&times;</button><h3>#'+id+' '+esc(a.title||'')+'</h3><div class="meta"><span class="tag '+auditCls(a.title)+'">audit</span>'+(a.engine?'<span class="tag t-mut">'+esc(a.engine)+'</span>':'')+(a.by?'<span class="tag t-mut">'+esc(a.by)+'</span>':'')+(a.cdt?'<span class="tag t-mut">'+esc(a.cdt)+'</span>':'')+'</div>'+fld('Established',a.established)+fld('Notes',a.notes);document.getElementById('ov').classList.add('on');}
function renderBB(){var el=document.getElementById('bbscope');var sc=el?el.value:'unfinished';return rpc('blackboard',{scope:sc}).then(function(d){var rows=(d&&d.entries)||[];var h='<div class="ovgrid"><div class="kpi"><div class="n">'+esc(d.unfinished_count)+'</div><div class="l">Unfinished</div></div><div class="kpi"><div class="n">'+esc(d.total_count)+'</div><div class="l">Total entries</div></div></div>';h+='<p class="stamp">'+esc(d.legend||'')+'</p>';h+=rows.length?('<div class="card">'+rows.map(function(b){return '<div class="item" onclick="bbOpen('+b.id+')"><div class="g"><span class="ttl">'+esc(b.ref||'')+' &mdash; '+esc(b.subject||'')+'</span><span class="sub">to '+esc(b.to||'')+' &middot; '+esc(b.type||'')+' &middot; '+esc(b.body_chars||0)+' chars'+(b.claimed_by?(' &middot; held by '+esc(b.claimed_by)):'')+'</span></div><span class="tag '+bbPrio(b.priority)+'">'+esc(b.priority||'')+'</span><span class="tag '+bbStat(b.status)+'">'+esc(b.status||'')+'</span><span class="chev">&rsaquo;</span></div>';}).join('')+'</div>'):empty();listHTML(h);}).catch(fail);}
function bbOpen(id){var sh=document.getElementById('sheet');sh.innerHTML='<div class="loading">Loading...</div>';document.getElementById('ov').classList.add('on');rpc('bb_entry',{id:id}).then(function(d){var C='<button class="closeb" onclick="closeSheet()">&times;</button>';var e=d&&d.entry;if(!e){sh.innerHTML=C+'<p>Not found.</p>';return;}var h=C+'<h3>'+esc(e.entry_ref||'')+' &mdash; '+esc(e.subject||'')+'</h3><div class="meta"><span class="tag '+bbPrio(e.priority)+'">'+esc(e.priority||'')+'</span><span class="tag '+bbStat(e.status)+'">'+esc(e.status||'')+'</span><span class="tag t-teal">to '+esc(e.addressed_to||'')+'</span><span class="tag t-mut">'+esc(e.entry_type||'')+'</span><span class="tag t-mut">'+esc(e.entry_date||'')+'</span></div>';h+=fld('Body',e.body);if(e.claimed_by)h+=fld('Claimed by',e.claimed_by);if(e.refs&&e.refs.length)h+=fld('Refs',[].concat(e.refs).join(', '));var reps=(d.replies)||[];if(reps.length){h+='<div class="h2">Replies</div>';reps.forEach(function(r){h+='<div class="turn"><div class="who who-cha">'+esc(r.entry_ref||'')+' &middot; '+esc(r.entry_type||'')+' &middot; '+esc(r.status||'')+'</div><div class="body">'+esc(r.subject||'')+'\n\n'+esc(r.body||'')+'</div></div>';});}sh.innerHTML=h;}).catch(sheetFail);}
var __prevSetupCtl=setupCtl;
setupCtl=function(){var c=document.getElementById('ctl');if(cur==='audit'){c.innerHTML=si('Search audit — title, established, notes, engine');return;}if(cur==='bb'){c.innerHTML='<div class="row2"><select id="bbscope" onchange="loadTab()"><option value="unfinished">Unfinished only</option><option value="all">All entries</option></select></div>';return;}return __prevSetupCtl.apply(this,arguments);};
var __prevLoadTab2=loadTab;
loadTab=function(){if(cur==='audit'){clrErr();return renderAudit();}if(cur==='bb'){clrErr();return renderBB();}var r=__prevLoadTab2.apply(this,arguments);if(cur==='overview'&&r&&r.then){r.then(function(){return rpc('dashboard').then(function(d){var k=(d&&d.kpis)||{};var g=document.querySelector('#list .ovgrid');if(g){var mk=function(n,l,tab){var el=document.createElement('div');el.className='kpi';el.innerHTML='<div class="n">'+esc(n)+'</div><div class="l">'+l+'</div>';el.style.cursor='pointer';el.onclick=function(){go(tab);};return el;};g.appendChild(mk(k.audit_rows,'Audit','audit'));g.appendChild(mk(k.bb_open,'BB open','bb'));}var bb=(d&&d.blackboard)||[];if(bb.length){var el2=document.getElementById('list');if(el2)el2.insertAdjacentHTML('beforeend','<div class="h2">Blackboard &mdash; unfinished</div><div class="card">'+bb.map(function(b){return '<div class="item" onclick="go(\'bb\')"><div class="g"><span class="ttl">'+esc(b.ref||'')+' &mdash; '+esc(b.subject||'')+'</span><span class="sub">to '+esc(b.to||'')+'</span></div><span class="tag '+bbPrio(b.priority)+'">'+esc(b.priority||'')+'</span><span class="tag '+bbStat(b.status)+'">'+esc(b.status||'')+'</span></div>';}).join('')+'</div>');}}).catch(function(e){});});}return r;};
/* ==== end Audit + BB additions ==== */

/* ==== Day Room tab — Eric-ruled 2026-08-05 (read-only observation; Eric does not speak in these rooms) ==== */
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='bb'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['dayroom','Day Room']);})();
function drRpc(fn,args){return fetch(BASE+fn,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify(args||{})}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error('HTTP '+r.status+' '+t.slice(0,140));});return r.json();});}
function drStat(s){s=String(s||'').toUpperCase();return s==='OPEN'?'t-blue':(s==='RESTING'?'t-green':'t-mut');}
function drAgo(ts){if(!ts)return 'no posts yet';var m=Math.floor((Date.now()-new Date(ts).getTime())/60000);if(m<1)return 'just now';if(m<60)return m+'m ago';var h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago';}
function renderDayRoom(){return drRpc('dr_rooms',{}).then(function(rows){rows=rows||[];var open=0,posts=0;rows.forEach(function(r){if(r.status==='OPEN')open++;posts+=(parseInt(r.posts)||0);});var h='<div class="ovgrid"><div class="kpi"><div class="n">'+open+'</div><div class="l">Open rooms</div></div><div class="kpi"><div class="n">'+posts+'</div><div class="l">Posts total</div></div></div>';h+='<p class="stamp">Observation only — no compose box by design; Eric does not speak in these rooms. DR-0001 is the lobby and index.</p>';h+=rows.length?('<div class="card">'+rows.map(function(r){return '<div class="item" onclick="drOpenRoom('+r.id+')"><div class="g"><span class="ttl">'+esc(r.room_ref||('#'+r.id))+' &mdash; '+esc(r.subject||'')+'</span><span class="sub">'+esc(r.opened_by||'')+' &middot; '+(r.posts||0)+' posts &middot; '+drAgo(r.last_post_at)+'</span></div><span class="tag '+drStat(r.status)+'">'+esc(r.status||'')+'</span><span class="chev">&rsaquo;</span></div>';}).join('')+'</div>'):empty();listHTML(h);}).catch(fail);}
function drOpenRoom(id){var sh=document.getElementById('sheet');sh.innerHTML='<div class="loading">Loading room...</div>';document.getElementById('ov').classList.add('on');drRpc('dr_read',{p_room:id}).then(function(d){var C='<button class="closeb" onclick="closeSheet()">&times;</button>';var r=d&&d.room;if(!r){sh.innerHTML=C+'<p>Not found.</p>';return;}var h=C+'<h3>'+esc(r.room_ref||'')+' &mdash; '+esc(r.subject||'')+'</h3><div class="meta"><span class="tag '+drStat(r.status)+'">'+esc(r.status||'')+'</span><span class="tag t-mut">opened by '+esc(r.opened_by||'')+'</span><span class="tag t-mut">'+esc(String(r.created_at||'').slice(0,16).replace('T',' '))+'</span>'+(r.rested_by?'<span class="tag t-mut">rested by '+esc(r.rested_by)+'</span>':'')+'</div>';var ps=(d.posts)||[];if(!ps.length)h+='<div class="empty">No posts yet.</div>';var who=['who-def','who-cha','who-syn'];var seen={};var n=0;ps.forEach(function(p){var a=String(p.author||'?');if(!(a in seen)){seen[a]=who[n%who.length];n++;}h+='<div class="turn"><div class="who '+seen[a]+'">'+esc(a)+(p.session_id?(' &middot; '+esc(String(p.session_id).slice(0,8))):'')+' &middot; '+esc(String(p.created_at||'').slice(5,16).replace('T',' '))+'</div><div class="body">'+esc(p.body)+'</div></div>';});h+='<button class="btn" style="margin-top:6px" onclick="drOpenRoom('+id+')">Refresh room</button>';sh.innerHTML=h;}).catch(sheetFail);}
var __prevSetupCtlDR=setupCtl;
setupCtl=function(){if(cur==='dayroom'){document.getElementById('ctl').innerHTML='<button class="btn" onclick="loadTab()">Refresh rooms</button>';return;}return __prevSetupCtlDR.apply(this,arguments);};
var __prevLoadTabDR=loadTab;
loadTab=function(){if(cur==='dayroom'){clrErr();return renderDayRoom();}return __prevLoadTabDR.apply(this,arguments);};
/* ==== end Day Room additions ==== */
/* ==== launchDebate rebuild — 2026-08-14, advisor fix (Eric-authorized) ==== */
function ldOut(){var d=document.getElementById('dout');if(d)return d;var l=document.getElementById('list');if(!l||!l.parentNode)return null;d=document.createElement('div');d.id='dout';l.parentNode.insertBefore(d,l);return d;}
var __prevGoLD=go;
go=function(){var d=document.getElementById('dout');if(d)d.innerHTML='';return __prevGoLD.apply(this,arguments);};
window.launchDebate = function(){
  var b = document.getElementById('dbtn');
  var t = (document.getElementById('dtopic')||{}).value || '';
  var e = (document.getElementById('deng')||{}).value || 'deepseek';
  var r = parseInt((document.getElementById('drounds')||{}).value || '3', 10);
  var out = ldOut() || document.getElementById('list');
  function say(msg, isErr){
    if(out){ out.innerHTML = '<div style="padding:12px;border-radius:10px;margin:10px 0;'+
      (isErr?'background:#3a1520;color:#ff8fa3':'background:#122b22;color:#7fe0c0')+'">'+msg+'</div>' + (isErr?out.innerHTML:''); }
    else { alert(msg); }
  }
  if(t.trim().length < 6){ say('Give a fuller topic (6+ characters).', true); return; }
  if(b){ b.disabled = true; b.textContent = 'Launching…'; }
  rpc('launch_debate', { p_topic: t.trim(), p_engine: e, p_rounds: r })
    .then(function(res){
      if(b){ b.disabled = false; b.textContent = 'Launch debate'; }
      if(res && res.status === 'queued'){
        say('Debate queued on ' + (res.engine||e) + ' — token ' + res.queue_token);
        window.__dtopic = t.trim(); window.__dtoken = res.queue_token;
        if(typeof startPoll === 'function'){ try{ startPoll(res.queue_token); }catch(_e){} }
      } else if(res && res.status === 'busy'){
        say('Engine busy: ' + (res.message||'a debate is already running.'), true);
      } else {
        say('Unexpected reply: ' + JSON.stringify(res).slice(0,200), true);
      }
    })
    .catch(function(err){
      if(b){ b.disabled = false; b.textContent = 'Launch debate'; }
      say('Launch failed: ' + (err && err.message ? err.message : String(err)), true);
    });
};
/* ==== end launchDebate rebuild ==== */
/* ==== Wall board tab — read-only observation, 2026-08-15 (Eric-authorized; The Wall is append-only and Eric does not post here) ==== */
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='dayroom'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['wall','Wall']);})();
function wallRpc(fn,args){return drRpc(fn,args);}
function wallStat(s){s=String(s||'').toUpperCase();return s==='OPEN'?'t-blue':(s==='RESTING'?'t-green':'t-mut');}
function renderWall(){return wallRpc('wall_list',{}).then(function(d){var rows=(d&&d.walls)||[];var open=0;rows.forEach(function(r){if(String(r.status||'').toUpperCase()==='OPEN')open++;});var h='<div class="ovgrid"><div class="kpi"><div class="n">'+open+'</div><div class="l">Open walls</div></div><div class="kpi"><div class="n">'+rows.length+'</div><div class="l">Walls total</div></div></div>';h+='<p class="stamp">'+esc((d&&d.note)||'Observation only — The Wall is append-only; Eric does not post here. Standing walls never rest.')+'</p>';h+=rows.length?('<div class="card">'+rows.map(function(r){return '<div class="item" onclick="wallOpen('+r.id+')"><div class="g"><span class="ttl">'+esc(r.subject||'')+'</span><span class="sub">'+esc(r.ref||('#'+r.id))+' &middot; '+esc(r.author||'')+' &middot; '+(r.replies||0)+' replies &middot; '+drAgo(r.last_post)+'</span></div><span class="tag '+wallStat(r.status)+'">'+esc(r.status||'')+'</span>'+(r.standing?'<span class="tag t-gold">standing</span>':'')+'<span class="chev">&rsaquo;</span></div>';}).join('')+'</div>'):empty();listHTML(h);}).catch(fail);}
function wallOpen(id){var sh=document.getElementById('sheet');sh.innerHTML='<div class="loading">Loading wall...</div>';document.getElementById('ov').classList.add('on');wallRpc('wall_read',{p_root:id}).then(function(d){var C='<button class="closeb" onclick="closeSheet()">&times;</button>';var w=d&&d.wall;if(!w){sh.innerHTML=C+'<p>Not found.</p>';return;}var h=C+'<h3>'+esc(w.subject||'')+'</h3><div class="meta"><span class="tag '+wallStat(w.status)+'">'+esc(w.status||'')+'</span>'+(w.standing?'<span class="tag t-gold">standing</span>':'')+(w.wall_ref?'<span class="tag t-mut">'+esc(w.wall_ref)+'</span>':'')+'<span class="tag t-mut">opened by '+esc(w.author||'')+'</span><span class="tag t-mut">'+esc(String(w.created_at||w.opened||'').slice(0,16).replace('T',' '))+'</span></div>';h+=fld('Body',w.body);var ps=(d.replies)||[];if(!ps.length)h+='<div class="empty">No replies yet.</div>';var who=['who-def','who-cha','who-syn'];var seen={};var n=0;ps.forEach(function(p){var a=String(p.author||'?');if(!(a in seen)){seen[a]=who[n%who.length];n++;}h+=turn(esc(a)+(p.kind?(' &middot; '+esc(p.kind)):'')+(p.posted?(' &middot; '+esc(String(p.posted).slice(5,16).replace('T',' '))):''),seen[a],p.body);});h+='<button class="btn" style="margin-top:6px" onclick="wallOpen('+id+')">Refresh wall</button>';sh.innerHTML=h;}).catch(sheetFail);}
var __prevSetupCtlWall=setupCtl;
setupCtl=function(){if(cur==='wall'){document.getElementById('ctl').innerHTML='<button class="btn" onclick="loadTab()">Refresh walls</button>';return;}return __prevSetupCtlWall.apply(this,arguments);};
var __prevLoadTabWall=loadTab;
loadTab=function(){if(cur==='wall'){clrErr();return renderWall();}return __prevLoadTabWall.apply(this,arguments);};
/* ==== end Wall additions ==== */
/* ==== List controls — search / status / sort / jump for tabs 1-10 (Eric-authorized 2026-08-30) ==== */
(function(){var s=document.createElement('style');s.textContent='.lc-hit{outline:2px solid var(--gold);outline-offset:-2px;background:var(--panel2)}.lc-j{flex:1;min-width:0}';document.head.appendChild(s);})();
window.__lcRows=window.__lcRows||{};window.__lcMeta=window.__lcMeta||{};
var LC={};
function lcGet(t){if(!LC[t])LC[t]={q:'',st:'',dir:'desc',jump:'',scope:'unfinished'};return LC[t];}
function lcNum(ref,fb){var m=String(ref==null?'':ref).match(/(\d+)/);return m?parseInt(m[1],10):(parseInt(fb,10)||0);}
function lcItem(type,id,ttl,sub,right,num){return '<div class="item" data-lcnum="'+num+'" onclick="openItem(\''+type+'\','+JSON.stringify(id)+')"><div class="g"><span class="ttl">'+ttl+'</span>'+(sub?'<span class="sub">'+sub+'</span>':'')+'</div>'+(right||'')+'<span class="chev">&rsaquo;</span></div>';}
function lcRaw(onclk,ttl,sub,right,num){return '<div class="item" data-lcnum="'+num+'" onclick="'+onclk+'"><div class="g"><span class="ttl">'+ttl+'</span>'+(sub?'<span class="sub">'+sub+'</span>':'')+'</div>'+(right||'')+'<span class="chev">&rsaquo;</span></div>';}
var LCCFG={
 sights:{ph:'Search sights',lab:'sight #',fetch:function(){return rpc('dash_sights',{q:'',lim:2000});},
  num:function(r){return parseInt(r.sight_number,10)||0;},
  text:function(r){return [r.title,r.passage,r.topic,r.layer,r.status].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('sight',r.sight_number,'#'+r.sight_number+' '+esc(r.title||''),esc(r.passage||r.topic||''),'<span class="tag '+stat(r.status)+'">'+esc(r.layer||r.status||'')+'</span>',r.sight_number);}},
 conclusions:{ph:'Search conclusions (text or #id)',lab:'conclusion #',fetch:function(){return rpc('dash_conclusions',{q:'',lim:2000});},
  num:function(r){return parseInt(r.id,10)||0;},
  text:function(r){return [r.snippet,r.passage,r.layer,r.status].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('conclusion',r.id,'#'+r.id+' '+esc(r.snippet||''),esc(r.passage||'')+(r.layer?(' &middot; '+esc(r.layer)):''),'<span class="tag '+stat(r.status)+'">'+esc(r.status||'')+'</span>',r.id);}},
 tensions:{ph:'Search tensions (item, anchor, notes or #tid)',lab:'tid',fetch:function(){return rpc('dash_tensions').then(function(rows){window.__ten=rows||[];return rows;});},
  num:function(r){return parseInt(r.id,10)||0;},
  text:function(r){return [r.item,r.anchor,r.notes,r.status].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('tension',r.id,esc(r.item||''),'tid '+r.id+' &middot; '+esc(r.updated||''),'<span class="tag '+stat(r.status)+'">'+esc(r.status||'')+'</span>',r.id);}},
 todos:{ph:'Search todos (title, category, description)',lab:'todo #',fetch:function(){return rpc('dash_todos').then(function(rows){window.__todo=rows||[];return rows;});},
  num:function(r){return parseInt(r.id,10)||0;},
  text:function(r){return [r.title,r.category,r.description,r.notes,r.status,r.priority].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('todo',r.id,'#'+r.id+' '+esc(r.title||''),esc(r.category||''),'<span class="tag '+prio(r.priority)+'">'+esc(r.priority||'')+'</span>',r.id);}},
 guards:{ph:'Search guards',lab:'DG #',fetch:function(){return rpc('dash_guards').then(function(rows){window.__guardAll=rows||[];window.__guard=rows||[];return rows;});},
  num:function(r){return parseInt(r.rule_num,10)||0;},
  text:function(r){return [r.subject,r.rule,r.priority,r.status].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('guard',r.rule_num,'DG-'+r.rule_num+' '+esc(r.subject||''),'','<span class="tag '+prio(r.priority)+'">'+esc(r.priority||'')+'</span>',r.rule_num);}},
 journal:{ph:'Search journal',lab:'entry #',fetch:function(){return rpc('dash_journal',{q:'',lim:2000});},
  num:function(r){return parseInt(r.entry_num,10)||0;},
  text:function(r){return [r.title,r.date].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcItem('journal',r.entry_num,'#'+r.entry_num+' '+esc(r.title||'(untitled)'),esc(r.date||''),'',r.entry_num);}},
 audit:{ph:'Search audit',lab:'audit #',fetch:function(){return rpc('audit',{q:'',lim:2000}).then(function(rows){window.__audit=rows||[];return rows;});},
  num:function(r){return parseInt(r.id,10)||0;},
  text:function(r){return [r.title,r.cdt,r.engine,r.by,r.established,r.notes,r.status].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return lcRaw('auditOpen('+r.id+')','#'+r.id+' '+esc(r.title||''),esc(r.cdt||'')+(r.engine?(' &middot; '+esc(r.engine)):''),'<span class="tag '+auditCls(r.title)+'">'+esc(String(r.title||'log').split(/[\s:\u2014]/)[0].slice(0,10))+'</span>',r.id);}},
 bb:{ph:'Search blackboard',lab:'BB #',scoped:true,
  fetch:function(){var s=lcGet('bb');return rpc('blackboard',{scope:s.scope}).then(function(d){window.__lcMeta.bb=d||{};return (d&&d.entries)||[];});},
  num:function(r){return lcNum(r.ref,r.id);},
  text:function(r){return [r.ref,r.subject,r.to,r.type,r.claimed_by,r.status,r.priority].join(' ');},
  status:function(r){return r.status;},
  head:function(){var d=window.__lcMeta.bb||{};return '<div class="ovgrid"><div class="kpi"><div class="n">'+esc(d.unfinished_count)+'</div><div class="l">Unfinished</div></div><div class="kpi"><div class="n">'+esc(d.total_count)+'</div><div class="l">Total entries</div></div></div>'+(d.legend?'<p class="stamp">'+esc(d.legend)+'</p>':'');},
  row:function(r){return lcRaw('bbOpen('+r.id+')',esc(r.ref||'')+' &mdash; '+esc(r.subject||''),'to '+esc(r.to||'')+' &middot; '+esc(r.type||'')+' &middot; '+esc(r.body_chars||0)+' chars'+(r.claimed_by?(' &middot; held by '+esc(r.claimed_by)):''),'<span class="tag '+bbPrio(r.priority)+'">'+esc(r.priority||'')+'</span><span class="tag '+bbStat(r.status)+'">'+esc(r.status||'')+'</span>',lcNum(r.ref,r.id));}},
 dayroom:{ph:'Search rooms',lab:'DR #',fetch:function(){return drRpc('dr_rooms',{}).then(function(rows){return rows||[];});},
  num:function(r){return lcNum(r.room_ref,r.id);},
  text:function(r){return [r.room_ref,r.subject,r.opened_by,r.status].join(' ');},
  status:function(r){return r.status;},
  head:function(all){var open=0,posts=0;all.forEach(function(r){if(r.status==='OPEN')open++;posts+=(parseInt(r.posts)||0);});return '<div class="ovgrid"><div class="kpi"><div class="n">'+open+'</div><div class="l">Open rooms</div></div><div class="kpi"><div class="n">'+posts+'</div><div class="l">Posts total</div></div></div><p class="stamp">Observation only &mdash; no compose box by design; Eric does not speak in these rooms. DR-0001 is the lobby and index.</p>';},
  row:function(r){return lcRaw('drOpenRoom('+r.id+')',esc(r.room_ref||('#'+r.id))+' &mdash; '+esc(r.subject||''),esc(r.opened_by||'')+' &middot; '+(r.posts||0)+' posts &middot; '+drAgo(r.last_post_at),'<span class="tag '+drStat(r.status)+'">'+esc(r.status||'')+'</span>',lcNum(r.room_ref,r.id));}},
 wall:{ph:'Search walls (subject, author, ref, "standing")',lab:'WALL #',fetch:function(){return wallRpc('wall_list',{}).then(function(d){window.__lcMeta.wall=d||{};return (d&&d.walls)||[];});},
  num:function(r){return lcNum(r.ref,r.id);},
  text:function(r){return [r.ref,r.subject,r.author,r.status,(r.standing?'standing':'')].join(' ');},
  status:function(r){return r.status;},
  head:function(all){var open=0;all.forEach(function(r){if(String(r.status||'').toUpperCase()==='OPEN')open++;});var d=window.__lcMeta.wall||{};return '<div class="ovgrid"><div class="kpi"><div class="n">'+open+'</div><div class="l">Open walls</div></div><div class="kpi"><div class="n">'+all.length+'</div><div class="l">Walls total</div></div></div><p class="stamp">'+esc(d.note||'Observation only — The Wall is append-only; Eric does not post here.')+'</p>';},
  row:function(r){return lcRaw('wallOpen('+r.id+')',esc(r.subject||''),esc(r.ref||('#'+r.id))+' &middot; '+esc(r.author||'')+' &middot; '+(r.replies||0)+' replies &middot; '+drAgo(r.last_post),'<span class="tag '+wallStat(r.status)+'">'+esc(r.status||'')+'</span>'+(r.standing?'<span class="tag t-gold">standing</span>':''),lcNum(r.ref,r.id));}},
 overview:{ph:'Search criticals',lab:'todo #',inline:true,
  num:function(r){return parseInt(r.id,10)||0;},
  text:function(r){return [r.title,r.status,r.priority,r.category].join(' ');},
  status:function(r){return r.status;},
  row:function(r){return '<div class="item" data-lcnum="'+(parseInt(r.id,10)||0)+'" onclick="go(\'todos\')"><div class="g"><span class="ttl">'+esc(r.title)+'</span><span class="sub">critical todo #'+r.id+'</span></div><span class="tag t-red">Critical</span></div>';}}
};
function lcStatuses(t){var c=LCCFG[t],rows=window.__lcRows[t]||[],v=[];if(!c.status)return v;rows.forEach(function(r){var x=c.status(r);if(x!=null&&String(x)!==''&&v.indexOf(String(x))<0)v.push(String(x));});return v.sort();}
function lcCtlHTML(t){var c=LCCFG[t],s=lcGet(t),vals=lcStatuses(t);
 var h='<input class="search" id="lc_q_'+t+'" placeholder="'+esc(c.ph)+'" value="'+esc(s.q)+'" oninput="lcOn(\''+t+'\')" autocomplete="off">';
 h+='<div class="row2">';
 if(c.scoped)h+='<select id="lc_sc_'+t+'" onchange="lcScope(\''+t+'\')"><option value="unfinished"'+(s.scope==='unfinished'?' selected':'')+'>Unfinished only</option><option value="all"'+(s.scope==='all'?' selected':'')+'>All entries</option></select>';
 if(vals.length)h+='<select id="lc_st_'+t+'" onchange="lcOn(\''+t+'\')"><option value="">All statuses</option>'+vals.map(function(v){return '<option value="'+esc(v)+'"'+(s.st===v?' selected':'')+'>'+esc(v)+'</option>';}).join('')+'</select>';
 h+='<select id="lc_dir_'+t+'" onchange="lcOn(\''+t+'\')"><option value="desc"'+(s.dir==='desc'?' selected':'')+'>'+esc(c.lab)+' \u2193</option><option value="asc"'+(s.dir==='asc'?' selected':'')+'>'+esc(c.lab)+' \u2191</option></select>';
 h+='<input class="lc-j" id="lc_j_'+t+'" type="number" placeholder="Jump to #" value="'+esc(s.jump)+'" oninput="lcJump(\''+t+'\')" autocomplete="off">';
 h+='</div><button class="btn" onclick="lcRefresh(\''+t+'\')">Refresh</button>';
 if(c.inline)h+='<p class="stamp" id="lc_note_'+t+'"></p>';
 return h;}
function lcSyncCtl(t){var el=LCCFG[t]&&LCCFG[t].inline?document.getElementById('lc_bar_'+t):document.getElementById('ctl');if(el)el.innerHTML=lcCtlHTML(t);}
function lcOn(t){var s=lcGet(t);var q=document.getElementById('lc_q_'+t),st=document.getElementById('lc_st_'+t),d=document.getElementById('lc_dir_'+t);
 if(q)s.q=q.value;if(st)s.st=st.value;if(d)s.dir=d.value;lcRender(t);}
function lcScope(t){var s=lcGet(t),el=document.getElementById('lc_sc_'+t);if(el)s.scope=el.value;lcRefresh(t);}
function lcRefresh(t){if(LCCFG[t]&&LCCFG[t].inline)return loadTab();return lcLoad(t,true);}
function lcApply(t,rows){var c=LCCFG[t],s=lcGet(t);
 var out=rows.filter(function(r){
  if(s.st&&c.status&&String(c.status(r)||'')!==s.st)return false;
  if(s.q){var q=s.q.toLowerCase();var hay=(String(c.text(r)||'')+' '+String(c.num(r))+' #'+String(c.num(r))).toLowerCase();if(hay.indexOf(q)<0)return false;}
  return true;});
 out.sort(function(a,b){if(c.cmp){var cd=c.cmp(a,b);return s.dir==='asc'?cd:-cd;}var x=c.num(a),y=c.num(b);return s.dir==='asc'?x-y:y-x;});
 return out;}
function lcRender(t){var c=LCCFG[t],s=lcGet(t),all=window.__lcRows[t]||[],shown=lcApply(t,all);
 if(c.inline){var card=document.getElementById('lc_card_'+t);if(!card)return;
  card.innerHTML=shown.length?shown.map(c.row).join(''):'<div class="empty">Nothing here.</div>';
  var nt=document.getElementById('lc_note_'+t);if(nt)nt.innerHTML='Showing '+shown.length+' of '+all.length+((s.q||s.st)?' &middot; filtered':'');
  return;}
 var h=(c.head?c.head(all,shown):'');
 h+='<p class="stamp">Showing '+shown.length+' of '+all.length+((s.q||s.st)?' &middot; filtered':'')+'</p>';
 h+=shown.length?('<div class="card">'+shown.map(c.row).join('')+'</div>'):empty();
 listHTML(h);}
function lcJump(t){var el=document.getElementById('lc_j_'+t);if(!el)return;var v=String(el.value||'').trim();lcGet(t).jump=v;if(!v)return;
 var hit=document.querySelector('#list [data-lcnum="'+v+'"]');
 if(!hit){var c=LCCFG[t],all=window.__lcRows[t]||[];
  var exists=all.some(function(r){return String(c.num(r))===v;});
  if(exists){var s=lcGet(t);s.q='';s.st='';lcSyncCtl(t);lcRender(t);var j=document.getElementById('lc_j_'+t);if(j)j.focus();hit=document.querySelector('#list [data-lcnum="'+v+'"]');}}
 if(hit){hit.scrollIntoView({block:'center',behavior:'smooth'});hit.classList.add('lc-hit');setTimeout(function(){hit.classList.remove('lc-hit');},1800);}}
function lcLoad(t,force){var c=LCCFG[t];
 if(!force&&window.__lcRows[t]){lcSyncCtl(t);lcRender(t);return Promise.resolve();}
 listHTML('<div class="loading">Loading...</div>');
 return c.fetch().then(function(rows){window.__lcRows[t]=rows||[];lcSyncCtl(t);lcRender(t);}).catch(fail);}
/* Overview: capture criticals at the data layer, then upgrade the rendered card in place
   so the existing KPI grid / Links row / Blackboard sections keep rendering untouched. */
var __lcOrigRpc=rpc;
rpc=function(fn,args){var p=__lcOrigRpc.apply(this,arguments);
 if(fn==='dashboard_json')return p.then(function(d){window.__lcRows.overview=(d&&d.criticals)||[];return d;});
 return p;};
function lcOvUpgrade(){var list=document.getElementById('list');if(!list)return;
 if(document.getElementById('lc_bar_overview'))return;
 var card=list.querySelector('.card');if(!card)return;
 var bar=document.createElement('div');bar.id='lc_bar_overview';
 list.insertBefore(bar,card);
 card.id='lc_card_overview';
 lcSyncCtl('overview');lcRender('overview');}
var __prevSetupCtlLC=setupCtl;
setupCtl=function(){if(LCCFG[cur]&&!LCCFG[cur].inline){lcSyncCtl(cur);return;}return __prevSetupCtlLC.apply(this,arguments);};
var __prevLoadTabLC=loadTab;
loadTab=function(){
 if(cur==='overview'){var r=__prevLoadTabLC.apply(this,arguments);
  if(r&&r.then)r.then(function(){lcOvUpgrade();}).catch(function(){});
  return r;}
 if(LCCFG[cur]){clrErr();return lcLoad(cur,true);}
 return __prevLoadTabLC.apply(this,arguments);};
/* ==== end list controls ==== */
/* ==== Registry tab — crew seat registry, read-only (Eric-authorized 2026-09-03) ====
   Reuses the existing LCCFG list-controls engine and the drRpc direct-RPC helper.
   Sorts by last_active via the engine's optional cmp() hook, not by parseInt. */
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='wall'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['registry','Registry']);})();
function regTime(r){var t=Date.parse(r&&r.last_active);return isNaN(t)?0:t;}
function regStat(s){return String(s||'').toLowerCase()==='matched'?'t-green':'t-gold';}
function regOpen(id){
 var rows=window.__lcRows.registry||[],r=null;
 for(var i=0;i<rows.length;i++){if(String(rows[i].id)===String(id)){r=rows[i];break;}}
 var sh=document.getElementById('sheet');
 document.getElementById('ov').classList.add('on');
 var C='<button class="closeb" onclick="closeSheet()">&times;</button>';
 if(!r){sh.innerHTML=C+'<p>Not found.</p>';return;}
 var h=C+'<h3>'+esc(r.thread_title||'(untitled)')+'</h3><div class="meta"><span class="tag '+regStat(r.status)+'">'+esc(r.status||'')+'</span><span class="tag t-mut">'+esc(r.source||'')+'</span></div>';
 h+=fld('Seat',r.seat||'— no seat —');
 h+=fld('Thread title',r.thread_title);
 h+=fld('Session id',r.session_id);
 h+=fld('Source',r.source);
 h+=fld('Status',r.status);
 h+=fld('First seen',r.first_seen);
 h+=fld('Last active',r.last_active);
 h+=fld('Recorded at',r.recorded_at);
 sh.innerHTML=h;
}
LCCFG.registry={ph:'Search registry (title, seat, session, source)',lab:'date',
 fetch:function(){return drRpc('registry_list',{}).then(function(d){window.__lcMeta.registry=d||{};return (d&&d.rows)||[];});},
 num:function(r){return parseInt(r.id,10)||0;},
 cmp:function(a,b){return regTime(a)-regTime(b);},
 text:function(r){return [r.thread_title,r.seat,r.session_id,r.source,r.status].join(' ');},
 status:function(r){return r.status;},
 head:function(all){var m=0,u=0;all.forEach(function(r){if(String(r.status||'').toLowerCase()==='matched')m++;else u++;});var d=window.__lcMeta.registry||{};return '<div class="ovgrid"><div class="kpi"><div class="n">'+m+'</div><div class="l">Matched</div></div><div class="kpi"><div class="n">'+u+'</div><div class="l">Unmatched</div></div><div class="kpi"><div class="n">'+all.length+'</div><div class="l">Total</div></div></div>'+(d.note?'<p class="stamp">'+esc(d.note)+'</p>':'');},
 row:function(r){return lcRaw('regOpen('+(parseInt(r.id,10)||0)+')',esc(r.thread_title||'(untitled)'),esc(r.seat||'— no seat')+' &middot; '+esc(r.session_id||'')+' &middot; '+esc(r.source||'')+' &middot; '+drAgo(r.last_active),'<span class="tag '+regStat(r.status)+'">'+esc(r.status||'')+'</span><span class="tag t-mut">'+esc(r.source||'')+'</span>',parseInt(r.id,10)||0);}};
/* ==== end Registry tab ==== */
/* ==== Notes tab (md_notes) — per-seat markdown notes, read-only (Eric-authorized 2026-09-04) ====
   Reuses the existing LCCFG list-controls engine, its cmp() date hook and the drRpc helper.
   thread_name is used as the status facet, so the filter acts as a per-thread filter.
   The note body is plain text in a .val (pre-wrap), so markdown line breaks survive as-is. */
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='registry'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['mdnotes','Notes']);})();
function mdTime(r){var t=Date.parse(r&&r.created_at);return isNaN(t)?0:t;}
function mdTrunc(s,n){s=String(s==null?'':s);n=n||22;return s.length>n?(s.slice(0,n-1)+'…'):s;}
function mdOpen(id){
 var rows=window.__lcRows.mdnotes||[],r=null;
 for(var i=0;i<rows.length;i++){if(String(rows[i].id)===String(id)){r=rows[i];break;}}
 var sh=document.getElementById('sheet');
 document.getElementById('ov').classList.add('on');
 var C='<button class="closeb" onclick="closeSheet()">&times;</button>';
 if(!r){sh.innerHTML=C+'<p>Not found.</p>';return;}
 var h=C+'<h3>'+esc(r.thread_name||'(unnamed)')+'</h3><div class="meta"><span class="tag t-teal">'+esc(r.seat_label||'')+'</span><span class="tag t-mut">'+esc(r.seat_session_id||'')+'</span><span class="tag t-mut">'+esc(String(r.created_at||'').slice(0,10))+'</span></div>';
 h+=fld('Note',r.note);
 sh.innerHTML=h;
}
LCCFG.mdnotes={ph:'Search notes (text, thread, seat, session)',lab:'date',
 fetch:function(){return drRpc('md_notes_list',{}).then(function(d){window.__lcMeta.mdnotes=d||{};return (d&&d.rows)||[];});},
 num:function(r){return parseInt(r.id,10)||0;},
 cmp:function(a,b){return mdTime(a)-mdTime(b);},
 text:function(r){return [r.note,r.thread_name,r.seat_label,r.seat_session_id].join(' ');},
 status:function(r){return r.thread_name;},
 head:function(all){var seen={},n=0;all.forEach(function(r){var k=String(r.seat_label||'');if(k&&!seen[k]){seen[k]=1;n++;}});var d=window.__lcMeta.mdnotes||{};return '<div class="ovgrid"><div class="kpi"><div class="n">'+all.length+'</div><div class="l">Notes</div></div><div class="kpi"><div class="n">'+n+'</div><div class="l">Seats</div></div></div>'+(d.note?'<p class="stamp">'+esc(d.note)+'</p>':'');},
 row:function(r){return lcRaw('mdOpen('+(parseInt(r.id,10)||0)+')',esc(r.thread_name||'(unnamed)'),esc(r.seat_label||'')+' &middot; '+drAgo(r.created_at)+' &middot; '+esc(r.chars||0)+' characters','<span class="tag t-mut">'+esc(mdTrunc(r.seat_label,22))+'</span>',parseInt(r.id,10)||0);}};
/* ==== end Notes tab ==== */
boot();
