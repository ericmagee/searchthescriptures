// W1 grade of pkgXK rev 2, stage B: a cut-off JSON cure reply. xkJson2024 returns a reply that does not parse unchanged, and the line reader then
// finds no RESPONSE or STATEMENT line in raw JSON, so every item reads "no written response". A cut-off line-form reply loses only its tail.
// Also counts finish_reason "length" over every saved openrouter cure reply. Run from wall2024/: node pkgXK/w1_grade/probe_XK_w1_trunc.cjs
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';let n=0,len=0;
for(const f of fs.readdirSync(D).filter(f=>/Cure_Call.*openrouter\.json$/.test(f))){try{const d=JSON.parse(fs.readFileSync(D+f,'utf8'));const r=Array.isArray(d)?d[0]:d;const it=((r.data&&r.data.main)||r.main)[0]||[];for(const x of it){const c=x.json&&x.json.choices&&x.json.choices[0];if(!c)continue;n++;if(c.finish_reason==='length')len++;}}catch(e){}}
console.log('saved openrouter cure replies '+n+', finish_reason length '+len);
const s=fs.readFileSync('pkgLIB/strip_XKB/patched/Panel_Cure_Normalize_1.js','utf8');const g=nm=>{const i=s.indexOf('function '+nm+'(');let d=0,k=s.indexOf('{',i);for(;k<s.length;k++){if(s[k]=='{')d++;else if(s[k]=='}'){d--;if(!d)break;}}return s.slice(i,k+1);};
const xk=new Function(g('xkJson2024')+';return xkJson2024;')();const cnt=x=>x.split('\n').filter(l=>/^(RESPONSE|STATEMENT):/.test(l)).length;
for(const m of ['openai__gpt-6.1-terra','openai__gpt-6.1-sol','openai__gpt-6-luna','anthropic__claude-haiku-5.5']){const R=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/xk_check_calls/'+m+'.resp.json','utf8'));
 const t=(R.choices||R[0].choices)[0].message.content;const cut=t.slice(0,Math.floor(t.length*0.6));
 console.log(m+': whole reply -> '+cnt(xk(t))+' lines read; cut at 60% -> '+cnt(xk(cut))+' lines read (returned unchanged: '+(xk(cut)===cut)+')');}
