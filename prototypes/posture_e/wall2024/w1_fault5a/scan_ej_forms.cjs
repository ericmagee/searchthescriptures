// W1, fault 5e (W3 Wall 4536): pkgRTE rev 3 part EJ reads a judge's own break line with
// /^D(\d+)\s+vs\.?\s+C(\d+)\b/i then /^D\d+\s+vs\.?\s+C\d+\s*(?:\([^)]*\))?\s*:\s*(DEFENDER|CHALLENGER) LINK BROKEN\b/ after stripping * _ `.
// Count, in every stored judge reply (first texts and cure replies), the LINK BROKEN collision lines a looser reader finds that this reader misses, by form.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const content=x=>{if(typeof x==='string')return x;if(x&&x.choices&&x.choices[0])return x.choices[0].message&&x.choices[0].message.content;return null;};
const flat=d=>{if(!Array.isArray(d))d=[d];const o=[];for(const e of d){if(e&&e.data&&e.data.main)for(const b of e.data.main)for(const it of (b||[]))o.push(it);}return o;};
const texts=[];const add=(k,arr)=>{for(const it of arr){const j=it.json||it;const t=content(j.response!==undefined?j.response:j);if(t)texts.push({k,t:t.replace(/\\n/g,'\n')});}};
for(const f of fs.readdirSync(W+'inputs').filter(f=>/_(Panel_Judge_\d|Panel_Cure_Call_\d|Send_Back_Call|Alt_Send_Back_Call|Alternate_Calls)_?openrouter\.json$|_Panel_Judge_\d_openrouter\.json$/.test(f)))add(f,flat(JSON.parse(fs.readFileSync(W+'inputs/'+f))));
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f))){const r=(JSON.parse(fs.readFileSync(W+f)).data||{}).resultData;if(!r)continue;for(const [n,rs] of Object.entries(r.runData))if(/^Panel Judge \d openrouter$|Cure Call|Send Back Call/.test(n))for(const x of rs)if(x.data&&x.data.main)for(const b of x.data.main)add(f+':'+n,b||[]);}
const LIVE=t=>{const s=t.replace(/[*_`]+/g,'').trim();return /^D(\d+)\s+vs\.?\s+C(\d+)\b/i.test(s)&&/^D\d+\s+vs\.?\s+C\d+\s*(?:\([^)]*\))?\s*:\s*(DEFENDER|CHALLENGER) LINK BROKEN\b/.test(s);};
const LOOSE=/D\d+\s+vs\.?\s+C\d+\b[^\n]{0,160}?:\s*\W*(defender|challenger)\s+link\s+broken\b/i;
const forms={};let seen=0,missed=0;const ex={};
for(const {k,t} of texts)for(const l of t.split('\n')){if(!LOOSE.test(l)||/^\s*\W*FORCED/i.test(l)||/SENDBACK\s*:/i.test(l))continue;seen++;if(LIVE(l))continue;missed++;const s=l.replace(/[*_`]+/g,'').trim();
 const f=/^[-•>]\s*|^\d+[.)]\s*/.test(s)?'leading bullet or number':!/^D\d+/i.test(s)?'pair not at line start':/LINK BROKEN/.test(s)?(/\([^)]*\([^)]*\)/.test(s)?'nested brackets':'other'):'lowercase grade';forms[f]=(forms[f]||0)+1;(ex[f]=ex[f]||[]).length<8&&ex[f].push(k.slice(0,40)+' | '+s.slice(0,140));}
console.log('judge texts',texts.length,'| LINK BROKEN collision lines (loose reader)',seen,'| missed by the EJ reader',missed);console.log(JSON.stringify(forms));for(const [f,a] of Object.entries(ex)){console.log('--',f);a.forEach(x=>console.log('  ',x));}
