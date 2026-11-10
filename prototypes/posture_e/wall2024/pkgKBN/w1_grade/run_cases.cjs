// W1 grade of pkgKBN rev 1: runs cases.json (labels fixed before the run) through the whole Send Back Record node, live s100 against parent_s100_KBN.json.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BS=g('/mnt/project-files/wall2024/fetchback_live_s100.json'),PK=g('pkgKBN/parent_s100_KBN.json');const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const pcn=R=>{const m=cl(PCN);m.forEach(a=>a&&a.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const row=async(W,R,line)=>{const o=await H.run(code(W,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)});return o[0].json.sb_rows.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));};
const C=JSON.parse(fs.readFileSync(__dirname+'/cases.json','utf8')).cases;let ok=0,bad=0,miss=[];const out=[];
(async()=>{for(const c of C){const R=Object.assign({},R0,{CR4:R0.CR4+'\n'+c.s});const line='SENDBACK: S3 || KEEP || "'+c.s.replace(/^-\s+/,'').replace(/\*\*/g,'')+'"';
 const l=await row(BS,R,line),k=await row(PK,R,line);const s=String(k.cure_reason);const i=s.indexOf('CURE (');const why=s.slice(i+31,i+200);
 const good=k.cure_status===c.want&&(!c.reason||why.includes(c.reason));if(good)ok++;else{bad++;miss.push(c.id);}
 console.log((good?'OK   ':'MISS ')+c.id+' want '+c.want+' | live '+l.cure_status+' | KBN '+k.cure_status+' | '+c.s+'\n       '+why);out.push(k);}
 console.log(ok+' of '+C.length+' as labeled; misses: '+(miss.join(', ')||'none'));fs.writeFileSync(__dirname+'/rows.json',JSON.stringify(out.filter((r,j)=>['K1','K6'].includes(C[j].id)).map(r=>({...r,run_token:'W1-ROLLBACK-TEST-KBN'}))));})();
