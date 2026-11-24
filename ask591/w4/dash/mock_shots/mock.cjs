const {chromium}=require('playwright');const fs=require('fs');
const L='/mnt/project-files/ask591/w4/dash_live/',N='/mnt/project-files/ask591/w4/dash/';
const file=p=>fs.existsSync(N+p)?N+p:L+p;
const MC=JSON.parse(fs.readFileSync('/mnt/project-files/ask591/w4/b1/mc_active.json','utf8'));const M={};MC.forEach(x=>M[x.seat]=x);
const JFL={chatgpt:{move:true,c:{'K-G4':{state:'ALTERNATE'},'E-GATE':{state:'ALTERNATE'},'K-V':{state:'EXAMPLES'}}},sol:{move:true,c:{'K-W':{state:'ALTERNATE'}}},argon:{move:true,c:{'E-APPLY':{state:'ALTERNATE'}}},gemini:{c:{'K-F':{state:'EXAMPLES'}}},spark:{c:{'E-COL':{state:'COUNTING'}}},sonnet:{c:{'E-APPLY':{state:'EXAMPLES'}}},qwen4max:{c:{'K-W':{state:'COUNTING'}}},sol62:{c:{'E-GATE':{state:'EXAMPLES'}}}};
let order={panel:['chatgpt','sol','sol62'],alternate:['gemini','spark','qwen4max','argon','sonnet']},ver=1,saves=[];
const seats=()=>[...order.panel.map((s,i)=>[s,'panel',i+1]),...order.alternate.map((s,i)=>[s,'alternate',i+1])].map(([s,l,o])=>({seat:s,list:l,ord:o,api_model:(M[s]||{}).api_model,family:(M[s]||{}).family,active:true,jfl_move:!!(JFL[s]||{}).move,jfl_counts:(JFL[s]||{}).c||{}}));
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
 await pg.addInitScript(()=>sessionStorage.setItem('tad_pass','mock'));
 await pg.route('**/*',async r=>{const u=r.request().url();
  if(u.startsWith('http://dash.local/')){const p=u.slice(18).split('?')[0]||'index.html';return r.fulfill({path:file(p),contentType:p.endsWith('.js')?'application/javascript':'text/html'});}
  if(u.includes('/rpc/dash_api')){const q=JSON.parse(r.request().postData());let d={};
   if(q.p_action==='judge_order')d={version:ver,saved_at:'2026-11-24T14:40:00Z',seats:seats()};
   else if(q.p_action==='judge_order_save'){saves.push(q.p_arg);order={panel:q.p_arg.p_panel,alternate:q.p_arg.p_alt};ver++;d={ok:true,version:ver};}
   else if(q.p_action==='judge_lineup')d={panel:['sol62','gemini','spark'],reserve:'qwen4max',alternates:['qwen4max','sonnet'],single_judge:'sol62',moved:['chatgpt','sol','argon'],dropped:{chatgpt:'is a debater',sol:'family openai debates in this debate',argon:'(MOCK) moved to the end by the fault ledger'},note:'As the engine would seat it now. (MOCK DATA)'};
   else if(q.p_action==='odv1_engines')d=[{key:'claude',api_model:'anthropic/claude-opus-4.5'},{key:'chatgpt',api_model:'openai/gpt-5.5'},{key:'sol62',api_model:'openai/gpt-6.2-sol'}];
   else d=[];return r.fulfill({contentType:'application/json',body:JSON.stringify(d)});}
  return r.abort();});
 await pg.goto('http://dash.local/index.html');await pg.waitForTimeout(800);
 const tabs=await pg.$$eval('.tab',e=>e.map(x=>x.textContent));
 await pg.evaluate(()=>go('judges'));await pg.waitForTimeout(800);
 await pg.screenshot({path:'m1_tab.png',fullPage:true});
 await pg.click('#jolists .card:nth-of-type(2) .item:nth-child(1) button:nth-of-type(3)').catch(e=>errs.push('click1 '+e.message));
 await pg.evaluate(()=>joMove('panel',2,-1));await pg.evaluate(()=>joMove('panel',1,-1));await pg.waitForTimeout(200);
 const draft=await pg.evaluate(()=>({p:JO.panel.slice(),a:JO.alternate.slice(),dirty:JO.dirty}));
 await pg.screenshot({path:'m2_dirty.png',fullPage:true});
 await pg.evaluate(()=>joSave());await pg.waitForTimeout(800);
 const after=await pg.evaluate(()=>({p:JO.panel.slice(),a:JO.alternate.slice(),msg:document.getElementById('jomsg').textContent}));
 await pg.screenshot({path:'m3_saved.png',fullPage:true});
 const sw=await pg.evaluate(()=>document.documentElement.scrollWidth);
 console.log(JSON.stringify({tabs,draft,saves,after,sw,errs},null,0));await b.close();})();
