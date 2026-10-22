// Pre-write check (Worker_A3, BB-7514): runs odOpen from the given odv1.js on stored dash_odv1_by_id output; not a test (BB-7519).
const fs=require('fs');const [,,odv1,dataFile]=process.argv;
const idx=fs.readFileSync(__dirname+'/base/index.html','utf8');
const pick=n=>idx.split('\n').find(l=>l.startsWith('function '+n+'('));
const D=JSON.parse(fs.readFileSync(dataFile,'utf8'));
const els={};const el=id=>els[id]||(els[id]={innerHTML:'',value:'',classList:{add(){},remove(){}}});
const ctx=new Function('document','rpc','D',pick('esc')+'\n'+pick('turn')+`
var TABS=[['challenger','Challenger']];function setupCtl(){};function loadTab(){};var cur='odv1';
function sheetFail(e){throw e;};function closeSheet(){};function listHTML(){};function fail(e){throw e;};function empty(){return '';};function clrErr(){};function showErr(){};
`+fs.readFileSync(odv1,'utf8')+`\nreturn {odOpen, esc, odSAN};`);
const api=ctx({getElementById:el},(fn,a)=>{if(fn!=='odv1_by_id')throw new Error('rpc '+fn);return Promise.resolve(D);},D);
api.odOpen(D.id);
setTimeout(()=>{const h=el('sheet').innerHTML;const has=s=>h.indexOf(s)>-1;const out={};
 out['F1.1 summary Single judge row']=has('<span class="sub">Single judge</span>');
 out['F1.2 judges-card Single judge row']=has('<span class="ttl">Single judge &middot;');
 out['F1.3 Synthesis turn']=has('>Synthesis</div>');
 out['F1.4 Standings turn']=has('>Standings</div>')||has('Framework: ');
 out['F1.5 Single judge turn']=has('>Single judge — ');
 const pieces=(t)=>{t=api.esc(t||'');const r=[];for(let i=0;i+200<=t.length;i+=997)r.push(t.slice(i,i+200));return r;};
 out['F1.x synthesis pieces on page']=pieces(D.synthesis).filter(has).length;
 out['F1.x independent_verdict_raw pieces on page']=pieces(api.odSAN(D.independent_verdict_raw)).filter(has).length;
 out['F2 Panel HELD (3-0)']=has('Panel: HELD (3-0)');
 out['F2 judgments printed']=D.judges.map(j=>j.seat+':'+(has(api.esc(api.odSAN(j.verdict_raw)))&&has(j.verdict))).join(',');
 out['F2 outcome tag']=has(api.esc(D.outcome));
 out['F2 round turns']=['def_r1','cha_r1','def_r2','cha_r2','def_r3','cha_r3'].filter(k=>has(api.esc(api.odSAN(D[k])))).length;
 out['page md5']=require('crypto').createHash('md5').update(h).digest('hex');
 for(const k in out)console.log(k.padEnd(44),out[k]);},50);
