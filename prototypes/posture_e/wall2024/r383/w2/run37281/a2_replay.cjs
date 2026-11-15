// W2 replay of (a2): in kunxLines' plain branch, drop [Ln] tokens inside an ASSUMES clause (clause extent as pkgBKC reads it) before unxLack.
// Inputs: the 4 stored judge count lines (of 337 UNEXHIBITED count lines) where ASSUMES is followed on the line by an [Ln] token (SQL, 06:01Z 11-15).
const fs=require('fs'),zlib=require('zlib');
const W=JSON.parse(fs.readFileSync(__dirname+'/../../../writes_s209/fetchback_live_s209.json','utf8'));const w=W.nodes?W:(W.workflow||W.data);
const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');const src=rb(MAP['Gate Build'],LIB);
const STRIP="(s=>String(s).replace(/\\bASSUMES\\b[^]*?(?=\\s+(?:--|—|–)\\s+|\\bROWS\\s+GIVE\\b|$)/g,m=>m.replace(/\\[L[1-4]\\]/g,'')))";
const OLD='const nl=all.map(z=>unxLack(z.seg,kk))';if(src.split(OLD).length!==2)throw new Error('anchor count '+(src.split(OLD).length-1));
const srcA2=src.replace(OLD,'const nl=all.map(z=>unxLack('+STRIP+'(z.seg),kk))');
const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
const load=s=>{globalThis.__K=null;try{new Function('$','$input','items','$json','$node','$execution','$workflow','require','globalThis.__K=kunxLines;\n'+s)($,null,[],{},{},{},{},require);}catch(e){}return globalThis.__K;};
const K0=load(src),K2=load(srcA2);const strip=eval(STRIP);
const rounds=JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../../data/rounds8.json.gz')));
const lines=JSON.parse(fs.readFileSync(__dirname+'/a2_lines.json','utf8'));
for(const x of lines){const t=x.t.replace(/^SENDBACK:[^|]*\|\|\s*CHANGE TO:\s*/,'').split(' || ')[0];const same=strip(t)===t;let d=rounds.find(r=>r.id===x.debate_id);if(!d&&/37281/.test(x.run_token)){const stub=n=>'**LINK '+n+': SUPPORTED.**\n\n- **[L1]** Luke 1:31: "thou shalt conceive in thy womb"\n- **[L3]** Luke 1:27: "espoused to a man whose name was Joseph"\n\n---\n\n';d={engine_r3:stub(1)+stub(2)+stub(3)+stub(4)+fs.readFileSync(__dirname+'/b5_37281.txt','utf8'),challenger_r3:''};}
 let res=same?'rounds not in rounds8; a2 input identical, so output identical':'NO ROUNDS';
 if(d){const R={CR3:d.engine_r3||'',DR3:d.challenger_r3||''};const a=K0('DEFENSE STANDING: x\n'+t,R).items,b=K2('DEFENSE STANDING: x\n'+t,R).items;res='current '+a.length+' ['+a.map(i=>(i.a||'plain')+': '+i.why.slice(0,110)).join(' | ')+']  a2 '+b.length+' ['+b.map(i=>(i.a||'plain')+': '+i.why.slice(0,110)).join(' | ')+']';}
 console.log(x.run_token,x.seat,'| clause holds [Ln]:',!same,'|',res);}
