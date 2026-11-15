const fs=require('fs'),zlib=require('zlib');const D='/home/claude/searchthescriptures/prototypes/posture_e/wall2024/';
const c=JSON.parse(fs.readFileSync(D+'r383/f2/target_F2.json','utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const a=c.indexOf('const cecNar='),b=c.indexOf('\n',a);const nar=new Function(c.slice(a,b)+';return cecNar;')();
const rows=JSON.parse(zlib.gunzipSync(fs.readFileSync(D+'r383/data/rounds8.json.gz')));const R=JSON.parse(fs.readFileSync(D+'r383/data/runs.json','utf8'));const all=Object.values(R).map(x=>x.r).concat(rows);
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const h1f=t=>{const m={};for(const l of String(t||'').split('\n')){const x=l.match(/^\s*(?:#+\s*)?(?:D)?(\d+)[.):]\s+\**\s*([^\n]{12,300}?)(?:\.\s+Footing\b|\**\s*$)/);if(x&&!m[x[1]])m[x[1]]=norm(x[2]);}return m;};
const h4f=t=>{const m={};for(const l of String(t||'').split('\n')){const x=l.match(/^\s*[-*>]*\s*\**\s*D(\d+)\s*\**\s*[:.\-–—]?\s*\**\s*(.{12,300})$/);if(x&&!m[x[1]])m[x[1]]=norm(x[2]);}return m;};
const jac=(p,q)=>{const A=new Set(p.split(' ')),B=new Set(q.split(' '));return [...A].filter(w=>B.has(w)).length/new Set([...A,...B]).size;};
const seen=new Set();let n=0,narrowed=0,pairs=0;const out=[];
for(const r of all){if(!r||seen.has(r.id))continue;seen.add(r.id);n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3};
 const NL=nar(F,'DEFENDER');const links=new Set();for(const x of NL){const s=x.split('>>')[1]||x;for(const m of s.matchAll(/\b(?:D|LINK\s+)(\d+)\b/g))links.add(m[1]);}
 for(const m of String(r.engine_r3||'').matchAll(/LINK\s+(\d+)[^\n]{0,20}NARROWED TO/gi))links.add(m[1]);if(!links.size)continue;narrowed++;
 const h1=h1f(r.claude_r1),h4=h4f(r.defender_r4);for(const k of links)if(h1[k]&&h4[k]){pairs++;out.push(jac(h1[k],h4[k]).toFixed(2)+' '+String(r.id).slice(0,8)+' D'+k+': R1 "'+h1[k].slice(0,80)+'" | R4 "'+h4[k].slice(0,80)+'"');}}
console.log('debates',n,'defender sides with a narrowed link',narrowed,'narrowed links with R1 and R4 headings',pairs);console.log(out.sort().reverse().join('\n'));
