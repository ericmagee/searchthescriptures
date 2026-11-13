// pkgJC2 rev 2 (W3 5825 F1: the two confirmations must be of the same candidate id, side and link)
// pkgJC2 (W2, ASK 181; plan W1 Wall 5789): the judge-found contradiction path gets two independent checks, as pkgTWC gave
// the close enforcer. Judge Contradiction Build sends the same body twice (copy 1 at temperature 0, copy 2 at 0.6); the HTTP
// node already sends one call per item. Judge Contradiction Record reads both replies; a CONFIRMED row stays CONFIRMED only when
// the other check also confirms the same side and link, else "NOT CONFIRMED (one check of two)"; the second check's matching
// confirmation is stored "CONFIRMED (second check)" (one ledger row per link, as pkgTWC). Readers of jcc.confirmed are unchanged.
// usage: node pkgJC2/build.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const node=nm=>{const n=W.nodes.find(x=>x.name===nm);if(!n)throw new Error('no node '+nm);return n;};
const sub1=(n,A,B,what)=>{const T=n.parameters.jsCode;const k=T.split(A).length-1;if(k!==1)throw new Error('anchor '+what+' found '+k);n.parameters.jsCode=T.replace(A,()=>B);};
const size={};
// ---- Judge Contradiction Build: two items
{const n=node('Judge Contradiction Build');const t0=n.parameters.jsCode.length;
 sub1(n,"return [{json:{cec_skip:false,cands_only:true,answered_before,body,links,cands,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}}];",
 "return [{json:{cec_skip:false,cands_only:true,answered_before,body,links,cands,missing_rounds:miss,model:ds.api_model,run_token:S.run_token,copy:1}},{json:{cec_skip:false,cands_only:true,answered_before,body:{...body,temperature:0.6},links,cands,missing_rounds:miss,model:ds.api_model,run_token:S.run_token,copy:2}}]; /* pkgJC2: each judge-found candidate checked twice, independently (as pkgTWC) */",'JCB return');
 size[n.name]=n.parameters.jsCode.length-t0;}
// ---- Judge Contradiction Record: read both replies
{const n=node('Judge Contradiction Record');const t0=n.parameters.jsCode.length;
 sub1(n,"const B=$('Judge Contradiction Build').first().json;","const B=$('Judge Contradiction Build').first().json;const BA=$('Judge Contradiction Build').all().map(x=>x.json);const __two=BA.some(b=>b.copy===2); /* pkgJC2 */",'B');
 sub1(n,"const r=$input.first().json||{};let txt=null,err=null;try{txt=String(r.choices[0].message.content||'');}catch(e){err='no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')';}",
 "const RP=$input.all().map((it,k)=>{const r=it.json||{},b=BA[k]||{};const o={copy:b.copy||1,lab:b.copy===2?'second check':'first check',txt:null,err:null,n:0,none:false};try{o.txt=String(r.choices[0].message.content||'');}catch(e){o.err=(__two?o.lab+': ':'')+'no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')';}return o;});\nlet txt=RP.some(rp=>rp.txt!=null)?RP.filter(rp=>rp.txt!=null).map(rp=>rp.txt).join('\\n'):null,err=RP.filter(rp=>rp.err).map(rp=>rp.err).join('; ')||null; /* pkgJC2 */",'reply read');
 sub1(n,"for(const line of String(txt||'').split('\\n')){const s=line.trim();if(!s)continue;if(/^[\\s>*_-]*CLOSE-CONTRADICTION\\s*:\\s*\\**\\s*NONE\\b/i.test(s)){none=true;continue;}",
 "for(const rp of RP){const n0=rows.length;for(const line of String(rp.txt||'').split('\\n')){const s=line.trim();if(!s)continue;if(/^[\\s>*_-]*CLOSE-CONTRADICTION\\s*:\\s*\\**\\s*NONE\\b/i.test(s)){rp.none=true;continue;}",'loop head');
 sub1(n,"const side=m[2].toUpperCase(),P=CEC_PRE[side];const row={id:","const side=m[2].toUpperCase(),P=CEC_PRE[side];const row={copy:rp.copy,id:",'row copy');
 sub1(n," else row.status='NOT A CONTRADICTION';\n rows.push(row);}\n"," else row.status='NOT A CONTRADICTION';\n rows.push(row);}rp.n=rows.length-n0;}\nnone=RP.length>0&&RP.every(rp=>rp.none); /* pkgJC2 */\n",'loop tail');
 sub1(n,"const seen=new Set();const confirmed=[];",
 "if(__two)rows.forEach(x=>{if(x.status!=='CONFIRMED')return;if(rows.some(y=>y!==x&&y.copy!==x.copy&&y.status==='CONFIRMED'&&y.id===x.id&&y.side===x.side&&y.link===x.link))return;x.status='NOT CONFIRMED (one check of two)';x.note=(x.note?x.note+'; ':'')+'the other independent check did not confirm '+x.id+' on '+x.side+' LINK '+x.link+' (pkgJC2 rev 2: two confirmations of the same candidate needed)';});if(__two)rows.forEach(x=>{if(x.copy===2&&x.status==='CONFIRMED')x.status='CONFIRMED (second check)';}); /* pkgJC2, as pkgTWC: one ledger row per link */\nconst seen=new Set();const confirmed=[];",'two-check rule');
 sub1(n,"if(txt!=null&&!rows.length&&!none)errors.push('the reply holds no CLOSE-CONTRADICTION line');",
 "RP.forEach(rp=>{if(rp.txt!=null&&!rp.n&&!rp.none)errors.push((__two?rp.lab+': ':'')+'the reply holds no CLOSE-CONTRADICTION line');}); /* pkgJC2 */",'errors');
 sub1(n," .concat(!rows.length?[log({item:none?'NONE':'NO LINE',flagged_line:null,prompt_sent:prompt,full_reply:txt,response_line:none?'CLOSE-CONTRADICTION: NONE':null,cure_status:none?'NONE FOUND':'NOT CHECKED',cure_reason:errors.join('; ')||null,reply_error:err})]:[]);",
 " .concat(!__two?(!rows.length?[log({item:none?'NONE':'NO LINE',flagged_line:null,prompt_sent:prompt,full_reply:txt,response_line:none?'CLOSE-CONTRADICTION: NONE':null,cure_status:none?'NONE FOUND':'NOT CHECKED',cure_reason:errors.join('; ')||null,reply_error:err})]:[]):RP.filter(rp=>!rp.n).map(rp=>log({item:(rp.none?'NONE':rp.txt==null?'NOT CHECKED':'NO LINE')+' ('+rp.lab+')',flagged_line:null,prompt_sent:rows.length?'[SAME prompt_sent AS the first E-CLOSECON row]':prompt,full_reply:rp.txt,response_line:rp.none?'CLOSE-CONTRADICTION: NONE':null,cure_status:rp.none?'NONE FOUND':'NOT CHECKED',cure_reason:rp.none?null:(rp.err||rp.lab+': the reply holds no CLOSE-CONTRADICTION line'),reply_error:rp.err}))); /* pkgJC2: a check with no line is logged, as pkgTWC */",'log tail');
 size[n.name]=n.parameters.jsCode.length-t0;}
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('sizes',JSON.stringify(size),'total',Object.values(size).reduce((a,b)=>a+b,0),'| sha256',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));
