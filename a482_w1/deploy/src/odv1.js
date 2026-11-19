/* ==== Any vs Any tab: the ORACLE_DEBATE_V1 flow (any engine in either seat, one seat may be The Oracle) ==== */
/* ASK 482: display names, for new and old records alike (old debates may name qwen or deepseek; judges sit on the panel). */
var ODV1_ENG=[['claude','Claude'],['chatgpt','OpenAI'],['gemini','Gemini'],['grok','Grok'],['mimo','MiMo'],['haiku','Haiku'],['opus','Opus'],['glm','GLM'],['qwen4max','Qwen 4 Max'],['spark','Spark'],['qwen','Qwen'],['deepseek','DeepSeek'],['sol','Sol'],['sol62','Sol 6.2'],['hydrogen','Hydrogen'],['argon','Argon'],['sonnet','Sonnet'],['luna','Luna']];
/* ASK 482: the engines a debate may seat. Filled from the database (dash_api odv1_engines = dash_debaters(), the mirror of the engine's Init Seats list less refused engines), each with its model_config version. This static list is only the fallback when that read fails. */
var ODV1_PICK=[['claude','Claude'],['chatgpt','OpenAI'],['gemini','Gemini'],['grok','Grok'],['mimo','MiMo'],['haiku','Haiku'],['opus','Opus'],['glm','GLM'],['qwen4max','Qwen 4 Max'],['spark','Spark']];var ODV1_VER={};
function odLoadEng(){return rpc('odv1_engines').then(function(r){if(!Array.isArray(r)||!r.length)return;ODV1_PICK=r.map(function(x){ODV1_VER[x.key]=x.api_model||'';return [x.key,odMName(x.api_model)||x.name||odEng(x.key)];});[['oddeng','Defender: ','chatgpt'],['odceng','Challenger: ','claude']].forEach(function(a){var el=document.getElementById(a[0]);if(!el)return;var v=el.value;el.innerHTML=odOpts(a[1],ODV1_PICK.some(function(x){return x[0]===v;})?v:a[2]);});}).catch(function(){});}
/* Engines whose keys do not work yet: shown, not selectable. The database refuses them too (dash_launch_odv1). */
var ODV1_NOKEY={};
function odEng(e){for(var i=0;i<ODV1_ENG.length;i++){if(ODV1_ENG[i][0]===e)return ODV1_ENG[i][1];}return e||'?';}
/* ASK 482 rev 3 (operator 17:00Z: the model, not "chat gpt"): a name built from the model id itself, the same rule as dash_debaters(). openai/gpt-6.1-terra reads Terra 6.1; google/gemini-4-hydrogen reads Gemini 4 Hydrogen. With no model recorded, the engine name. */
function odMName(m){var s=String(m||'').replace(/^.*\//,'');if(!s)return '';var g=s.match(/^gpt-([0-9.]+)-([a-z]+)$/);if(g)return g[2].charAt(0).toUpperCase()+g[2].slice(1)+' '+g[1];var A={glm:'GLM',mimo:'MiMo',gpt:'GPT'};return s.split('-').map(function(t){return A[t]||(/^[a-z]/.test(t)&&!/^v[0-9]/.test(t)?t.charAt(0).toUpperCase()+t.slice(1):t);}).join(' ');}
function odRName(e,m){return odMName(m)||odEng(e);}
function odSide(e,p,m){return odRName(e,m)+(String(p||'')==='oracle'?' as The Oracle':'');}
function odOpts(pre,sel){return ODV1_PICK.map(function(x){var off=!!ODV1_NOKEY[x[0]];var ver=ODV1_VER[x[0]];return '<option value="'+x[0]+'"'+(off?' disabled':'')+(x[0]===sel&&!off?' selected':'')+'>'+pre+esc(x[1])+(ver?' ('+esc(ver)+')':'')+(off?' (key needed)':'')+'</option>';}).join('');}
function odOracle(me,other){if(odVal(me)==='oracle'){var o=document.getElementById(other);if(o)o.value='plain';}}
function odJName(e,m){return odMName(m)||(e==='deepseek'?'DeepSeek':odEng(e));}
function odJLine(js){return (js||[]).map(function(j){return odJName(j.seat,j.model)+' '+(j.verdict||'?');}).join(' &middot; ');}
/* Each verdict word grades the defender's chain. The side is named on a plain line that wraps, never inside a verdict badge (ORDER M, P5; badge overflow fixed 2026-10-17). */
function odVSideT(d){var cOr=!!d&&d.challenger_profile==='oracle';return "a grade of the defender's chain: "+odRName(d&&d.defender_engine,d&&d.defender_model)+", arguing "+(cOr?'the standard reading':"the record's reading");}
/* Times shown in Central, as the Summary's Date row already is (2026-10-17). */
function odCT(x){try{var t=new Date(x);if(isNaN(t.getTime()))return String(x||'');return t.toLocaleString('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});}catch(e){return String(x||'');}}
/* audience-facing text: record labels are back-office; the saved rows and the synthesis are untouched (operator 2026-10-17) */
var odSAN=x=>String(x==null?'':x).replace(/\s*\([^()\n]{0,160}?(?:DG-\d+|\bS-\d+|#\d+|\bSights?\s+#?\d+|\bConclusions?\s*#?\d+)[^()\n]{0,160}?\)/gi,'').replace(/\b(?:per|see|cf\.?)\s+(?:(?:DG-\d+|S-\d+|#\d+|Sights?\s+#?\d+|Conclusions?\s*#?\d+)\s*(?:,|and|&)?\s*)+[:,.;]?\s*/gi,'').replace(/(?:DG-\d+|\bS-\d+|\bSights?\s+#?\d+|\bConclusions?\s*#?\d+)(?:\s*\([a-z]\))?/gi,'').replace(/(^|[\s(])#\d+\b/g,'$1').replace(/^[ \t]*[,.;:]+[ \t]*$/gm,'').replace(/[ \t]{2,}/g,' ').replace(/ ([,.;:)])/g,'$1').replace(/\(\s*[,;]?\s*\)/g,'').replace(/\n{3,}/g,'\n\n');
function odTagCls(v){v=String(v||'').toUpperCase();return v==='HELD'?'t-green':(v==='BROKEN'?'t-red':'t-gold');}
function odVal(id){var e=document.getElementById(id);return e?e.value:'';}
function odBtn(){var b=document.getElementById('odbtn');if(b){b.disabled=false;b.textContent='Launch debate';}}
function odStop(){if(window.__odpoll){clearInterval(window.__odpoll);window.__odpoll=null;}}
(function(){var i=-1;for(var k=0;k<TABS.length;k++){if(TABS[k][0]==='challenger'){i=k;break;}}if(i<0)i=TABS.length-1;TABS.splice(i+1,0,['odv1','Any vs Any']);})();
var __odPrevSetupCtl=setupCtl;
setupCtl=function(){if(cur==='odv1')return;return __odPrevSetupCtl.apply(this,arguments);};
var __odPrevLoadTab=loadTab;
loadTab=function(){if(cur==='odv1'){clrErr();return renderOdv1();}return __odPrevLoadTab.apply(this,arguments);};
function renderOdv1(){
 document.getElementById('ctl').innerHTML='<input id="odtopic" placeholder="Debate topic" autocomplete="off">'
  +'<div class="row2"><select id="oddeng">'+odOpts('Defender: ','chatgpt')+'</select><select id="oddprof" onchange="odOracle(\'oddprof\',\'odcprof\')"><option value="plain">Defender plain</option><option value="oracle">Defender as The Oracle</option></select></div>'
  +'<div class="row2"><select id="odceng">'+odOpts('Challenger: ','claude')+'</select><select id="odcprof" onchange="odOracle(\'odcprof\',\'oddprof\')"><option value="plain">Challenger plain</option><option value="oracle">Challenger as The Oracle</option></select></div>'
  +'<button class="btn" id="odbtn" onclick="launchOdv1()">Launch debate</button>';
 odLoadEng();
 return loadOdv1List('<p class="stamp">Any engine in either seat. One seat may argue as The Oracle (with the record); the other is plain. The engine seats a panel of three judges, none of them a debater or of a debater&#39;s family; Claude never judges. A run takes about 20 to 45 minutes. Saved to debate_results.</p>');
}
function loadOdv1List(prefix){return rpc('odv1_debates').then(function(rows){var h=(prefix||'');if(rows&&rows.length){h+='<div class="h2">Recent Any vs Any debates</div><div class="card">'+rows.map(function(r){var d=odCT(r.created_at);return '<div class="item" onclick="odOpen(\''+r.id+'\')"><div class="g"><span class="ttl">'+esc(r.topic||'')+'</span><span class="sub">'+esc(odSide(r.defender_engine,r.defender_profile,r.defender_model))+' defends &middot; '+esc(odSide(r.challenger_engine,r.challenger_profile,r.challenger_model))+' challenges &middot; '+esc(d)+(r.note?' &middot; '+esc(r.note):'')+'</span>'+((r.judges&&r.judges.length)?'<span class="sub">Judges: '+odJLine(r.judges)+'</span>':'')+'<span class="sub" style="white-space:normal">Panel and judges: '+esc(odVSideT(r))+'</span></div><span class="tag '+odTagCls(r.panel_verdict)+'">Panel: '+esc(r.panel_verdict||'?')+'</span><span class="chev">&rsaquo;</span></div>';}).join('')+'</div>';}else{h+=empty();}listHTML(h);return rows;}).catch(fail);}
function launchOdv1(){
 var topic=odVal('odtopic').trim();if(topic.length<6){showErr('Give a fuller topic.');return;}clrErr();
 var a={p_topic:topic,p_def_engine:odVal('oddeng'),p_def_profile:odVal('oddprof'),p_ch_engine:odVal('odceng'),p_ch_profile:odVal('odcprof')};
 if(a.p_def_profile==='oracle'&&a.p_ch_profile==='oracle'){showErr('Only one side can be The Oracle.');return;}
 if(ODV1_NOKEY[a.p_def_engine]||ODV1_NOKEY[a.p_ch_engine]){showErr('MiMo, GLM and Qwen need working keys first.');return;}
 var b=document.getElementById('odbtn');b.disabled=true;b.textContent='Launching...';
 rpc('launch_odv1',a).then(function(res){
  if(!res||res.status!=='fired'){showErr('Launch: '+((res&&(res.message||res.error||res.status))||'no answer'));odBtn();return;}
  window.__odreq=res.request_id;window.__odtok=null;window.__odn=0;
  listHTML('<div class="loading">Sent: '+esc(res.defender)+' defends, '+esc(res.challenger)+' challenges. Waiting for the flow to accept...</div>');
  odStop();window.__odpoll=setInterval(odPoll,15000);setTimeout(odPoll,4000);
 }).catch(function(e){showErr('Launch failed: '+e.message);odBtn();});
}
function odPoll(){
 if(cur!=='odv1'){odStop();return;}
 window.__odn=(window.__odn||0)+1;
 if(!window.__odtok){return rpc('odv1_status',{p_req:window.__odreq}).then(function(s){
  if(!s||s.status==='pending'){if(window.__odn>8){odStop();odBtn();showErr('The flow did not answer the launch. Check n8n executions.');}else{listHTML('<div class="loading">Waiting for the flow to accept... ('+window.__odn+')</div>');}return;}
  if(s.status==='accepted'&&s.body&&s.body.run_token){window.__odtok=s.body.run_token;window.__odn=0;listHTML('<div class="loading">Accepted &middot; run '+esc(s.body.run_token)+'<br>Panel: '+esc((s.body.panel_expected||[]).join(', '))+'<br><span class="stamp">A run takes about 20 to 45 minutes; checking every 15 s.</span></div>');return;}
  odStop();odBtn();var m=(typeof s.body==='string')?s.body:((s.body&&(s.body.message||s.body.error))||s.error||('HTTP '+s.http));
  showErr('The flow refused the launch: '+String(m).slice(0,300));loadOdv1List('');
 }).catch(function(e){});}
 return rpc('odv1_debates').then(function(rows){
  var hit=(rows||[]).find(function(r){return r.run_token===window.__odtok;});
  if(hit){odStop();odBtn();odOpen(hit.id);loadOdv1List('');}
  else if(window.__odn>240){odStop();odBtn();showErr('No result after 60 minutes. Check n8n executions and debate_errors.');loadOdv1List('');}
  else{listHTML('<div class="loading">Running &middot; '+esc(window.__odtok)+' &middot; check '+window.__odn+'<br><span class="stamp">checking every 15 s</span></div>');}
 }).catch(function(e){});
}
function odOpen(id){
 var sh=document.getElementById('sheet');sh.innerHTML='<div class="loading">Loading transcript...</div>';document.getElementById('ov').classList.add('on');
 rpc('odv1_by_id',{p_id:id}).then(function(d){
  var x='<button class="closeb" onclick="closeSheet()">&times;</button>';
  if(!d||d.error){sh.innerHTML=x+'<p>Not found.</p>';return;}
  var D=odSide(d.defender_engine,d.defender_profile),C=odSide(d.challenger_engine,d.challenger_profile);
  var h=x+'<h3>'+esc(d.topic||'')+'</h3><div class="meta"><span class="tag t-teal">'+esc(D)+' defends</span><span class="tag t-gold">'+esc(C)+' challenges</span><span class="tag '+odTagCls(d.panel_verdict)+'">Panel: '+esc(d.panel_verdict||'?')+(d.panel_split?' ('+esc(d.panel_split)+')':'')+'</span>'+(d.outcome?'<span class="tag t-violet">'+esc(d.outcome)+'</span>':'')+'<span class="tag t-mut">'+esc(odCT(d.created_at))+'</span>'+(d.note?'<span class="tag t-red">'+esc(d.note)+'</span>':'')+'</div>';
  h+='<p class="stamp">Every grade on this page is '+esc(odVSideT(d))+'.</p>';
  var J=d.judges||[];
  /* Summary block: who argued what, who won, how it was judged, when (operator order 2026-10-08). */
  var cOr=d.challenger_profile==='oracle';var dpos=cOr?'the standard reading':"the record's reading",cpos=cOr?"the record's reading":'the standard reading';
  var prof=function(p){return p==='oracle'?'as The Oracle (with the record)':'plain';};
  var won=d.outcome?((/DEFENDER/i.test(d.outcome)?'Defender, '+odRName(d.defender_engine,d.defender_model)+': ':/CHALLENGER/i.test(d.outcome)?'Challenger, '+odRName(d.challenger_engine,d.challenger_model)+': ':'')+d.outcome):'Not decided: the panel did not finish';
  var ctm=function(s){try{return new Date(s).toLocaleString('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});}catch(e){return String(s||'');}};
  var row=function(k,v){return '<div class="item"><div class="g"><span class="sub">'+k+'</span><span class="ttl">'+v+'</span></div></div>';};
  h+='<div class="h2">Summary</div><div class="card">'
   +row('Result',esc(won))
   +row('Defender',esc(odRName(d.defender_engine,d.defender_model))+' ('+esc(d.defender_model||'model not recorded')+'), '+prof(d.defender_profile)+', arguing '+esc(dpos))
   +row('Challenger',esc(odRName(d.challenger_engine,d.challenger_model))+' ('+esc(d.challenger_model||'model not recorded')+'), '+prof(d.challenger_profile)+', arguing '+esc(cpos))
   +row('Panel',esc(d.panel_verdict||'not finished')+(d.panel_split?' ('+esc(d.panel_split)+')':'')+(J.length?' &middot; '+odJLine(J):''))
   +row('Date',esc(ctm(d.created_at))+(d.run_token?' &middot; run '+esc(d.run_token):''))
   +'</div>';
  h+='<div class="h2">Judges</div><div class="card"><div class="item"><div class="g"><span class="sub" style="white-space:normal">Every grade on this card is '+esc(odVSideT(d))+'.</span></div></div>'+J.map(function(j,i){return '<div class="item"><div class="g"><span class="ttl">Panel judge '+(i+1)+' &middot; '+esc(odJName(j.seat,j.model))+'</span><span class="sub">'+esc(j.model||'')+(j.defense_standing?' &middot; defense '+esc(j.defense_standing):'')+(j.challenge_standing?' &middot; challenge '+esc(j.challenge_standing):'')+'</span></div><span class="tag '+odTagCls(j.verdict)+'">'+esc(j.verdict||'?')+'</span></div>';}).join('')+(J.length?'':'<div class="item"><div class="g"><span class="ttl">No panel judgments recorded</span></div></div>')+'<div class="item"><div class="g"><span class="ttl">Panel result</span><span class="sub">'+esc(d.panel_split||'')+'</span></div><span class="tag '+odTagCls(d.panel_verdict)+'">'+esc(d.panel_verdict||'?')+'</span></div></div>';
  h+=turn('Defender — '+esc(D)+' · R1','who-def',odSAN(d.def_r1));
  h+=turn('Challenger — '+esc(C)+' · R1','who-cha',odSAN(d.cha_r1));
  h+=turn('Defender — '+esc(D)+' · R2','who-def',odSAN(d.def_r2));
  h+=turn('Challenger — '+esc(C)+' · R2','who-cha',odSAN(d.cha_r2));
  h+=turn('Defender — '+esc(D)+' · R3 link round','who-def',odSAN(d.def_r3));
  h+=turn('Challenger — '+esc(C)+' · R3 link round','who-cha',odSAN(d.cha_r3));
  J.forEach(function(j,i){h+=turn('Panel judge '+(i+1)+' — '+esc(odJName(j.seat,j.model))+' · '+esc(j.verdict||'?'),'who-syn',odSAN(j.verdict_raw));});
  sh.innerHTML=h;
 }).catch(sheetFail);
}
/* ==== end Any vs Any tab ==== */
