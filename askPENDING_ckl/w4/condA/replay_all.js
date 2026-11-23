const fs=require('fs');const B='/mnt/project-files/askPENDING_ckl/w4/build/';
const t=JSON.parse(fs.readFileSync(B+'target_engine_ckl.json','utf8'));const code=t.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
new Function('$','$input',code);
const pre=code.slice(code.indexOf('try{')+4,code.indexOf('const BA='));const blk=fs.readFileSync(B+'ckl_block.js','utf8');
const R=JSON.parse(fs.readFileSync('rounds_all.json','utf8'));const rows_in=JSON.parse(fs.readFileSync('rows_all.json','utf8'));
const MAP={cr1:'claude_r1',cr2:'claude_r2',cr3:'engine_r3',cr4:'defender_r4',gr1:'engine_r1',gr2:'engine_r2',dr3:'challenger_r3',dr4:'challenger_r4'};
// diagnostic (same helpers as the block): earlier block m, LINK n heading, word share
const diag=pre+`\nreturn rows.map(row=>{const er=row.earlier_round,raw=F[CEC_RK[er]];if(typeof raw!=='string')return 'earlier round '+er+' not a stored round';const m=cecBlk(row.side,row.earlier_q,raw);if(m==null)return 'm=null (earlier block unresolved)';if(m===row.link)return 'm='+m+' = n (same link)';
 const HR=new RegExp('^\\\\s*(?:#{1,4}\\\\s*[*_]*|[*_]{2})\\\\s*'+(row.side==='DEFENDER'?'(?:D|LINK\\\\s+)':'(?:C|LINK\\\\s+)')+'(\\\\d+)\\\\b');let on=false,head=null;const blk=[];for(const l of String(raw).split(/\\r?\\n/)){const h=l.match(HR);if(h){on=+h[1]===row.link;if(on&&head==null)head=l;}if(on)blk.push(l);}
 if(!head)return 'm='+m+', n='+row.link+': no LINK '+row.link+' heading in '+er;if(!/\\bSUPPORTED\\b/i.test(head))return 'm='+m+', n='+row.link+': heading not SUPPORTED ['+head.trim().slice(0,70)+']';
 const STOP=new Set('the a an and of to in is it its that this not no by as be for on with his her he she was were are which who from at or into these those there their them they than then so'.split(' '));const W=new Set(cecN(blk.join('\\n')).split(' '));const w=cecN(row.closing_q).split(' ').filter(x=>x&&!STOP.has(x));const k=w.filter(x=>W.has(x)).length;return 'm='+m+', n='+row.link+', SUPPORTED, '+k+' of '+w.length+' words';});`;
const out=[];const cov=new Set(JSON.parse(fs.readFileSync(B+'rows_in.json','utf8')).map(r=>r.id));
for(const tok of [...new Set(rows_in.map(r=>r.t))]){const D=R[tok];const F={};for(const k in MAP)F[k]=D?D[MAP[k]]:undefined;const rows=rows_in.filter(r=>r.t===tok).map(r=>({...r}));
 const dg=new Function('rows','F',diag)(rows,F);
 new Function('rows','F',pre+'\n'+blk)(rows,F);
 rows.forEach((r,i)=>out.push([r.id,tok.slice(5,10),r.side.slice(0,4),'LINK '+r.link,r.earlier_round+'>'+r.closing_round,cov.has(r.id)?'covered':'NEW-POP',r.status,dg[i]].join(' | ')));}
fs.writeFileSync('out_condA.txt',out.join('\n')+'\n');console.log(out.join('\n'));
const ch=out.filter(l=>!/\| CONFIRMED \|/.test(l));console.log('\nCHANGED:',ch.length);ch.forEach(l=>console.log(l));
