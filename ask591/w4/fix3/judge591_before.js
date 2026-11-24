/* ==== ASK 591: Judge order tab. The operator sets the order of the panel judges and the alternates; the engine reads the table odv1_judge_order at the start of each run.
   Reads: dash_api judge_order (dash_judge_order) and judge_lineup (dash_judge_lineup). Writes: judge_order_save (odv1_judge_order_save), which refuses and changes nothing unless every check passes. ==== */
var JO={panel:[],alternate:[],seats:{},version:null,saved_at:null,dirty:false};
var JO_RANK={COUNTING:1,EXAMPLES:2,ALTERNATE:3};
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='odv1'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['judges','Judge order']);})();
var __joPrevSetupCtl=setupCtl;
setupCtl=function(){if(cur==='judges')return;return __joPrevSetupCtl.apply(this,arguments);};
var __joPrevLoadTab=loadTab;
loadTab=function(){if(cur==='judges'){clrErr();return renderJudges();}return __joPrevLoadTab.apply(this,arguments);};

/* The fault ledger state of a seat: its highest state over all codes, with the codes in that state. */
function joLedger(s){var c=s&&s.jfl_counts;if(!c||typeof c!=='object')return {state:'',codes:[]};var top=0,codes=[];
 Object.keys(c).forEach(function(k){var r=JO_RANK[(c[k]&&c[k].state)||'']||0;if(r>top){top=r;codes=[k];}else if(r===top&&r>0)codes.push(k);});
 var st='';Object.keys(JO_RANK).forEach(function(k){if(JO_RANK[k]===top)st=k;});return {state:st,codes:codes};}
function joTag(st){return st==='ALTERNATE'?'t-red':(st==='EXAMPLES'?'t-gold':(st==='COUNTING'?'t-blue':'t-mut'));}
function joName(seat){var s=JO.seats[seat];return odMName(s&&s.api_model)||odEng(seat);}

function joRow(list,i){var seat=JO[list][i];var s=JO.seats[seat]||{};var L=joLedger(s);var n=JO[list].length;
 var other=list==='panel'?'alternates':'panel';
 return '<div class="item" style="cursor:default;flex-wrap:wrap"><span class="tag t-mut">'+(i+1)+'</span><div class="g"><span class="ttl">'+esc(joName(seat))+'</span>'
  +'<span class="sub" style="display:block;white-space:normal">'+esc(seat)+' &middot; '+esc(s.api_model||'no model row')+' &middot; '+esc(s.family||'no family')+' &middot; '+(s.active?'active':'NOT ACTIVE')+'</span>'
  +'<span class="sub" style="display:block;white-space:normal">Fault ledger: '+(L.state?'<span class="tag '+joTag(L.state)+'">'+esc(L.state)+'</span> '+esc(L.codes.join(', ')):'none')+(s.jfl_move?' &middot; moved to the end by the fault ledger':'')+'</span></div>'
  +'<div style="display:flex;gap:6px;width:100%;justify-content:flex-end">'
  +'<button class="lockb" '+(i===0?'disabled':'')+' onclick="joMove(\''+list+'\','+i+',-1)" aria-label="Up">&uarr;</button>'
  +'<button class="lockb" '+(i===n-1?'disabled':'')+' onclick="joMove(\''+list+'\','+i+',1)" aria-label="Down">&darr;</button>'
  +'<button class="lockb" onclick="joSwap(\''+list+'\','+i+')">To '+other+'</button></div></div>';}

function joDraw(){var el=document.getElementById('jolists');if(!el)return;
 var h='<div class="h2">Panel judges ('+JO.panel.length+')</div><div class="card">'+(JO.panel.length?JO.panel.map(function(x,i){return joRow('panel',i);}).join(''):empty())+'</div>'
  +'<div class="h2">Alternates ('+JO.alternate.length+')</div><div class="card">'+(JO.alternate.length?JO.alternate.map(function(x,i){return joRow('alternate',i);}).join(''):empty())+'</div>'
  +'<p class="stamp">A seat of the alternates list sits on the panel only when fewer than three panel seats are free. The engine&#39;s rules still decide who sits: a seat put first is still left out when its family debates, when the time rule removes it, or when the fault ledger moves it to the end. The line-up below shows that before a run. The panel list needs at least three seats; no seat is added or dropped here.</p>'
  +'<div class="row2"><button class="btn" id="josave" '+(JO.dirty?'':'disabled')+' onclick="joSave()">Save order</button><button class="btn" '+(JO.dirty?'':'disabled')+' onclick="loadTab()">Undo changes</button></div>'
  +'<p class="stamp" id="jomsg">'+(JO.dirty?'<b>Not saved.</b> The next run uses the saved order until you save.':'Saved order, version '+esc(JO.version)+(JO.saved_at?', '+esc(odCT(JO.saved_at)):'')+'. The next run reads it at its start; a run already going keeps the order it read.')+'</p>';
 el.innerHTML=h;}
function joMove(list,i,d){var a=JO[list],j=i+d;if(i<0||i>=a.length||j<0||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t;JO.dirty=true;joDraw();}
function joSwap(list,i){var to=list==='panel'?'alternate':'panel';var seat=JO[list].splice(i,1)[0];if(to==='panel')JO.panel.push(seat);else JO.alternate.unshift(seat);JO.dirty=true;joDraw();}

function joLoad(d){JO.seats={};JO.panel=[];JO.alternate=[];(d&&d.seats||[]).forEach(function(s){JO.seats[s.seat]=s;});
 (d&&d.seats||[]).slice().sort(function(a,b){return a.ord-b.ord;}).forEach(function(s){(s.list==='panel'?JO.panel:JO.alternate).push(s.seat);});
 JO.version=d&&d.version;JO.saved_at=d&&d.saved_at;JO.dirty=false;}

function joSave(){var b=document.getElementById('josave');if(b){b.disabled=true;b.textContent='Saving...';}
 rpc('judge_order_save',{p_panel:JO.panel,p_alt:JO.alternate}).then(function(r){
  if(!r||r.error){var m=document.getElementById('jomsg');if(m)m.innerHTML='<b>Not saved: '+esc((r&&r.error)||'no reply')+'</b>';if(b){b.disabled=false;b.textContent='Save order';}return;}
  /* read the table back and show it, as stored */
  return rpc('judge_order').then(function(d){joLoad(d);joDraw();var m=document.getElementById('jomsg');if(m)m.innerHTML='<b>Saved.</b> Version '+esc(d&&d.version)+', read back from the table. The next run seats judges in this order.';joLineup();});
 }).catch(fail);}

function joLineup(){var out=document.getElementById('jolineup');if(!out)return;var de=odVal('jodef'),ch=odVal('joch');
 if(!de||!ch||de===ch){out.innerHTML='<p class="stamp">Pick two different debaters.</p>';return;}
 out.innerHTML='<div class="loading">Loading...</div>';
 rpc('judge_lineup',{p_def:de,p_ch:ch}).then(function(r){
  if(!r){out.innerHTML=empty();return;}
  var dr=r.dropped||{};var left=Object.keys(dr).filter(function(k){return dr[k]!=='sits on the panel';});
  var h='<div class="card">';
  if(r.error){h+='<div class="item" style="cursor:default"><div class="g"><span class="ttl">'+esc(r.error)+'</span></div><span class="tag t-red">No panel</span></div>';}
  else{(r.panel||[]).forEach(function(s,i){h+='<div class="item" style="cursor:default"><span class="tag t-teal">Panel '+(i+1)+'</span><div class="g"><span class="ttl">'+esc(joName(s))+'</span><span class="sub">'+esc(s)+'</span></div></div>';});
   h+='<div class="item" style="cursor:default"><span class="tag t-gold">Reserve</span><div class="g"><span class="ttl">'+(r.reserve?esc(joName(r.reserve)):'none')+'</span>'+(r.reserve?'<span class="sub">'+esc(r.reserve)+'</span>':'')+'</div></div>';
   h+='<div class="item" style="cursor:default"><span class="tag t-violet">Alternates</span><div class="g"><span class="ttl" style="white-space:normal">'+((r.alternates&&r.alternates.length)?r.alternates.map(function(s,i){return (i+1)+'. '+esc(joName(s));}).join(' &middot; '):'none')+'</span></div></div>';}
  h+='</div>';
  if(left.length)h+='<div class="h2">Left out, and why</div><div class="card">'+left.map(function(k){return '<div class="item" style="cursor:default"><div class="g"><span class="ttl">'+esc(joName(k))+'</span><span class="sub" style="white-space:normal">'+esc(dr[k])+'</span></div></div>';}).join('')+'</div>';
  if(r.moved&&r.moved.length)h+='<p class="stamp">Moved to the end by the fault ledger now: '+r.moved.map(function(s){return esc(joName(s));}).join(', ')+'.</p>';
  h+='<p class="stamp">'+esc(r.note||'')+'</p>';
  out.innerHTML=h;}).catch(fail);}

function renderJudges(){
 document.getElementById('ctl').innerHTML='';
 return rpc('judge_order').then(function(d){joLoad(d);
  listHTML('<p class="stamp">The order the engine seats judges in. Reorder within a list with the arrows, or move a seat to the other list; then save. Every run reads the saved order at its start and records the order it used in its review notes.</p>'
   +'<div id="jolists"></div>'
   +'<div class="h2">The line-up for a debate</div>'
   +'<div class="row2"><select id="jodef" onchange="joLineup()">'+odOpts('Defender: ','chatgpt')+'</select><select id="joch" onchange="joLineup()">'+odOpts('Challenger: ','claude')+'</select></div>'
   +'<div id="jolineup"></div>');
  joDraw();
  odLoadEng().then(function(){[['jodef','Defender: ','chatgpt'],['joch','Challenger: ','claude']].forEach(function(a){var el=document.getElementById(a[0]);if(!el)return;var v=el.value;el.innerHTML=odOpts(a[1],v||a[2]);});joLineup();});
 }).catch(fail);}
/* ==== end Judge order tab ==== */
