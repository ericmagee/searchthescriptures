const fs=require('fs');const o=require('./ledger_out.json');const D='/mnt/project-files/wall2024/inputs/';
const T={};const txt=(R,k)=>{const key=R+k;if(key in T)return T[key];let v=null;try{v=JSON.parse(fs.readFileSync(D+R+'_'+(k[0]==='C'?'C':'D')+k[2]+'_Extract.json'))[0].data.main[0][0].json;v=v.labelled||v.raw;}catch(e){}return T[key]=v;};
const typ=(t,pos)=>{const ls=t.lastIndexOf('\n',pos)+1;const le=t.indexOf('\n',pos);const line=t.slice(ls,le<0?t.length:le);const before=t.slice(ls,pos);
 if(/press(?:ed)? with\s*:|PRESSED WITH|The press means|^\s*\*?Premise:/i.test(before)||/^\s*PRESSED WITH/i.test(line))return 'A-restates-press';
 if(/^\s*(?:[-*]\s*)?\*\*\s*(?:\([a-z0-9]\)\s*)?(?:Press\s+)?$/i.test(before)||/^\s*(?:[-*]\s*)?\*\*[^*]{0,40}$/.test(before)&&/\*\*/.test(line.slice(pos-ls)))return 'B-answer-label';
 if(/^\s*MEANS \[/.test(line))return 'B-answer-label';
 return 'C-other';};
const res={};const samp=[];
for(const p of o){if(p.cls==='NOT NAMED'){res[p.side+' NOT NAMED']=(res[p.side+' NOT NAMED']||0)+1;continue;}
 const ts=p.hits.map(h=>typ(txt(p.run,h.round),h.pos));const k=ts.includes('B-answer-label')?'answer label':ts.every(x=>x==='A-restates-press')?'ONLY restating the press':'other mention only';
 res[p.side+' NAMED, '+k]=(res[p.side+' NAMED, '+k]||0)+1;if(k!=='answer label')samp.push({run:p.run,side:p.side,ref:p.ref,k,hits:p.hits.map((h,i)=>({round:h.round,t:ts[i],snip:h.snip}))});}
Object.entries(res).sort().forEach(([k,v])=>console.log(v,k));fs.writeFileSync('ledger_samp.json',JSON.stringify(samp,null,1));
