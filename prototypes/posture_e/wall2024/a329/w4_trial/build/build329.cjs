// ASK 329 TRIAL build (record-only; Wall 6902/6903/6907/6908, team rule 6988 with W2 6990). Four nodes: L2 Count Plan, Quote Report, Build Save Body, Format Markdown.
const fs=require('fs'),cr=require('crypto');const IN=process.argv[2]||'../rdf/fetchback_s220_328.json',OUT=process.argv[3]||'target_329.json';
const d=JSON.parse(fs.readFileSync(IN));const N=nm=>d.nodes.find(x=>x.name===nm);
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const TRIAL=fs.readFileSync(__dirname+'/../a329/trial329.js','utf8').trim();
// 1 L2 Count Plan: the trial runs last, on a deep copy of the final tags; one new output key
{const n=N('L2 Count Plan');let s=n.parameters.jsCode;
 const RET="return [{json:{tags,claims,gloss,counts_url:L2C.countsUrl(nums),";
 const CALL=TRIAL+"\nconst __L2T329=(()=>{try{let F=null;try{if($('Regrade Load').isExecuted)F=$('Regrade Load').first().json.f;}catch(e){F=null;}if(!F)F=$('Final Output').first().json;const RA=[['DEFENDER','CR1',F.cr1],['CHALLENGER','DR1',F.gr1],['DEFENDER','CR2',F.cr2],['CHALLENGER','DR2',F.gr2],['DEFENDER','CR3',F.cr3],['CHALLENGER','DR3',F.dr3],['DEFENDER','CR4',F.cr4],['CHALLENGER','DR4',F.dr4]].filter(x=>x[2]);let kv=[];try{kv=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book&&typeof r.text==='string');}catch(e){kv=[];}return __l2trial329(JSON.parse(JSON.stringify(tags)),RA,ow,lex,kv);}catch(e){return {version:'329 TRIAL',items:[],n:{checked:0,same:0,not_counted:0,pair:0,review:0},error:String(e&&e.message||e).slice(0,200)};}})(); /* pkgL2T ASK 329: record-only; read only by Quote Report l2.trial */\n";
 s=once(s,RET,CALL+RET,'l2cp ret');
 s=once(s,"transliteration:r.transliteration}))}}];","transliteration:r.transliteration})),l2_trial:__L2T329}}];",'l2cp key');n.parameters.jsCode=s;}
// 2 Quote Report: l2.trial only
{const n=N('Quote Report');let s=n.parameters.jsCode;
 s=once(s,"l2:{tags:P.tags||[],counts:[],gloss:P.gloss||[]}","l2:{tags:P.tags||[],counts:[],gloss:P.gloss||[],trial:P.l2_trial||null}",'qr1');
 s=once(s,"l2:{tags:P.tags||[],counts,gloss:P.gloss||[]}","l2:{tags:P.tags||[],counts,gloss:P.gloss||[],trial:P.l2_trial||null}",'qr2');n.parameters.jsCode=s;}
// 3 Build Save Body: one AUDIT line
{const n=N('Build Save Body');let s=n.parameters.jsCode;
 const A=" {const TR=q&&q.l2&&q.l2.trial;if(TR&&TR.version){const c=TR.n||{};out.push('[AUDIT v56: [L2] BINDING TRIAL (ASK 329, record-only; nothing counted changes) -- '+(TR.error?'ERROR: '+TR.error+'; ':'')+(c.checked||0)+' COUNTED tags with no verse of their own checked; '+(c.same||0)+' same; '+(c.not_counted||0)+' NOT COUNTED; '+(c.pair||0)+' NUMBERING PAIR; '+(c.review||0)+' REVIEW'+((TR.items||[]).length?': '+TR.items.slice(0,12).map(x=>x.round+' '+x.word+' ('+x.num+'): '+x.trial+' -- '+String(x.why||'').slice(0,200)).join(' | '):'')+'.]');}} /* pkgL2T ASK 329 */\n return out;}catch(e){return [];}})();\nconst __CC=";
 s=once(s,"\n return out;}catch(e){return [];}})();\nconst __CC=",A,'bsb');n.parameters.jsCode=s;}
// 4 Format Markdown: one section
{const n=N('Format Markdown');let s=n.parameters.jsCode;
 const SEC="try { const __TR = QRd && QRd.l2 && QRd.l2.trial; if (__TR && __TR.version && (__TR.error || (__TR.items || []).length)) { const c = __TR.n || {}; t += '## [L2] binding trial (record-only)\\n\\nThis trial (ASK 329) binds each [L2] tag that names no verse of its own to the verses its own line or paragraph gives. It changes no count. ' + (__TR.error ? 'The trial stopped: ' + __TR.error + '. ' : '') + (c.checked || 0) + ' tags checked, ' + (c.same || 0) + ' the same as the count, ' + (c.not_counted || 0) + ' NOT COUNTED, ' + (c.pair || 0) + ' NUMBERING PAIR, ' + (c.review || 0) + ' REVIEW.\\n\\n'; (__TR.items || []).slice(0, 40).forEach(x => { t += '- ' + (x.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', ' + x.round + ', ' + x.word + ' (' + x.num + '): ' + x.trial + '. ' + String(x.why || '').slice(0, 300) + '\\n'; }); t += '\\n'; } } catch (e) {} /* pkgL2T ASK 329 */\n";
 s=once(s,"\nif (DRVR.length) {\n  const nc = DRVR.filter","\n"+SEC+"if (DRVR.length) {\n  const nc = DRVR.filter",'fm');n.parameters.jsCode=s;}
fs.writeFileSync(OUT,JSON.stringify(d));
for(const nm of ['L2 Count Plan','Quote Report','Build Save Body','Format Markdown']){const c=N(nm).parameters.jsCode;console.log(nm,c.length,cr.createHash('sha256').update(c).digest('hex').slice(0,12));}
