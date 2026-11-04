// The derived lists, with the expressions copied from new/Init Seats.js (ORDER0, NOT_PANEL, FAM_PANEL, free, pfree, panel_order, panel_reserve, ALT_ORDER).
const ORDER0=['deepseek','gemini','chatgpt','qwen','grok','sol'];
const JUDGE_TIME_REMOVED=['qwen'];
const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter'};
function run(Deng,Ceng,useNew){
 const ORDER=ORDER0;const seated={};seated[Deng]=true;seated[Ceng]=true;
 const NOT_PANEL=['deepseek','qwen'];const FAM_PANEL={chatgpt:'openai',sol:'openai'};const dfam=[FAM_PANEL[Deng],FAM_PANEL[Ceng]].filter(Boolean);
 const free=ORDER.filter(s=>!seated[s]);const pfree=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const panel_order=pfree.slice(0,3);
 const panel_reserve=free.indexOf('deepseek')>=0?'deepseek':((pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null);
 const ALT_ORDER=(useNew?pfree.slice(3).filter(s=>s!==panel_reserve):pfree.slice(4)).filter(s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0);
 return `panel=[${panel_order}] reserve=${panel_reserve} single=${free[0]} alternates=[${ALT_ORDER}]`;}
for(const [d,c] of [['claude','claude'],['chatgpt','claude'],['claude','deepseek'],['gemini','claude'],['grok','claude']])
 console.log(d+' vs '+c+'\n  OLD '+run(d,c,false)+'\n  NEW '+run(d,c,true));
