// W1 grade runner for pkgQRD (labels labels_QRD_w1.md). Offline. Same node runner shape as W2's test (RM.gate on the node's named inputs).
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s110.json'),N=Ld(process.env.BUILD||'pkgQRD/parent_s110_QRD.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const out=[];const T=(c,m)=>{const s=(c?'OK   ':'FAIL ')+m;out.push(s);console.log(s);};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;const st=n=>X[n]?X[n][0].data.main[0]:null;
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,name,over,input){const c=code(w,name);const s=n=>over&&over[n]!==undefined?over[n]:st(n);const inp=input||[];
 const mk=n=>{const it=s(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:'34299'})).map(x=>x.json);}
const ask=st('QR Ask');const F=st('Regrade Load')[0].json.f;
const obj=(A,k)=>{const t=A[k].json.choices[0].message.content;return JSON.parse(t.slice(t.indexOf('{'),t.lastIndexOf('}')+1));};
const setObj=(A,k,o)=>{A[k].json.choices[0].message.content=JSON.stringify(o);};
const plant=f=>{const A=cl(ask);const os=[0,1,2].map(k=>obj(A,k));f(os);os.forEach((o,k)=>setObj(A,k,o));return A;};
const ret=b=>b.map(j=>j.seat+':'+(j.retry?(Object.keys(j.redirect||{}).join('+')||'fault'):'-')).join(', ');
const lastMsg=j=>j.retry?j.body.messages[j.body.messages.length-1].content:'';
const sentences=t=>String(t||'').split(/(?<=[.!?])\s+/).filter(x=>x.length>40&&x.length<170&&!/["“”]/.test(x));
const rep=o=>({choices:[{message:{content:typeof o==='string'?o:JSON.stringify(o)}}]});
const finalRun=async(w,checkOut,idx,second)=>{const R=checkOut.map((j,i)=>i===idx?(second&&second.__err?{error:{message:'timeout'}}:rep(second)):rep('OK'));return go(w,'QR Final',{'QR Check':checkOut.map(j=>({json:j}))},R.map(r=>({json:r})));};
const recOf=(items,seat,side)=>items[0].record.find(r=>r.judge===seat&&r.side===side);
// Full matrix (labels_QRD_w1.md, section M). MODE=live writes the live counts only; otherwise live and candidate together.
const BAD='a quotation that does not stand anywhere';const SIDES={defender:{cl:'CR4',er:'CR3',other:'challenger'},challenger:{cl:'DR4',er:'DR3',other:'defender'}};
const fin=async(w,co,sec)=>{const R=co.map((j,i)=>{const x=sec[i];return x===undefined?rep('OK'):(x&&x.__err?{error:{message:'timeout'}}:rep(x));});try{return await go(w,'QR Final',{'QR Check':co.map(j=>({json:j}))},R.map(r=>({json:r})));}catch(e){if(/FAIL-CLOSED/.test(e.message))return null;throw e;}};
const pick=t=>{const ss=String(t).split(/(?<=[.!?])\s+/);const ok=x=>x&&x.length>25&&x.length<200&&!/["“”\[\]]/.test(x);const i=ss.findIndex((x,j)=>ok(x)&&ok(ss[j+1]));const rest=ss.filter((x,j)=>ok(x)&&j!==i&&j!==i+1);return {A:ss[i],B:ss[i+1],AB:ss[i]+' '+ss[i+1],C:rest[0],Z:[rest[1],rest[2],rest[3]],O:[rest[4],rest[5],rest[6]]};};
const seats=['luna','chatgpt','sol'];const MODE=process.env.MODE||'both';
(async()=>{const o0=[0,1,2].map(k=>obj(ask,k));let total=0,loss=0,drop=0,unexpl=0;const lines=[];const liveTab={};
 for(const side of ['defender','challenger']){const S=SIDES[side],os_=SIDES[S.other];
  const P=pick(side==='defender'?F.cr4:F.dr4),E=(side==='defender'?sentences(F.cr3):sentences(F.dr3))[0],Q=pick(side==='defender'?F.dr4:F.cr4),QE=(side==='defender'?sentences(F.dr3):sentences(F.cr3))[0];
  const base=k=>({...o0[k][side],round:S.cl,earlier_round:S.er,earlier_quote:E,question:'How do these two passages agree?'});
  const oth=k=>({...o0[k][S.other],round:os_.cl,earlier_round:os_.er,quote:Q.O[k],earlier_quote:QE,question:'How do these two passages agree?'});
  const PS=['A','B','AB','C'],FS=['none','other','same'],RS=['fail','change','keep'];
  for(let pc=0;pc<64;pc++){const SH=(process.env.SHARD||'0/1').split('/').map(Number);if(((side==='defender'?0:64)+pc)%SH[1]!==SH[0])continue;const pas=[pc%4,(pc>>2)%4,(pc>>4)%4].map(i=>PS[i]);
   for(let fc=0;fc<27;fc++){const fl=[fc%3,Math.floor(fc/3)%3,Math.floor(fc/9)].map(i=>FS[i]);
    const A=plant(os=>{os.forEach((o,k)=>{o[side]={...base(k),quote:P[pas[k]]};o[S.other]=oth(k);if(fl[k]==='other')o[S.other].quote=BAD;if(fl[k]==='same')o[side].question='';});});
    const cl_=await go(L,'QR Check',{},A);const cn=MODE==='live'?null:await go(N,'QR Check',{},A);
    for(let rc=0;rc<27;rc++){const rs=[rc%3,Math.floor(rc/3)%3,Math.floor(rc/9)].map(i=>RS[i]);
     const sec=co=>co.map((j,k)=>!j.retry?undefined:rs[k]==='fail'?{__err:1}:{[side]:{...base(k),quote:rs[k]==='change'?P.Z[k]:P[pas[k]]},[S.other]:oth(k)});
     const fL=await fin(L,cl_,sec(cl_));const ask_=(f,p,sd,src)=>!f?0:seats.filter(s=>{const r=recOf(f,s,sd);return r&&r.status!=='DROPPED'&&String(r.quote).includes(src[p]);}).length;
     const used=[...new Set(pas)];const lc=used.map(p=>ask_(fL,p,side,P)),lo=[0,1,2].map(k=>ask_(fL,k,S.other,Q.O));
     const key=side+' '+pas.join('/')+' f:'+fl.join('/')+' r:'+rs.join('/');liveTab[key]=used.map((p,i)=>p+'='+lc[i]).join(' ')+' other='+lo.join('')+(fL?'':' FAIL-CLOSED');total++;
     if(MODE==='live')continue;
     const fN=await fin(N,cn,sec(cn));const nc=used.map(p=>ask_(fN,p,side,P)),no=[0,1,2].map(k=>ask_(fN,k,S.other,Q.O));
     if(fL&&!fN){unexpl++;if(lines.length<60)lines.push('CANDIDATE FAIL-CLOSED where live runs: '+key);}
     const redir=cn.map(j=>j.retry&&j.redirect&&j.redirect[side]?1:0);
     used.forEach((p,i)=>{if(lc[i]>=1&&nc[i]===0){loss++;if(lines.length<60)lines.push('LOSS '+key+' '+p+': live '+lc[i]+', candidate 0; QR Check '+ret(cn));}
      else if(nc[i]<lc[i]){drop++;const rel=[0,1,2].some(k=>redir[k]&&(P[pas[k]].includes(P[p])||P[p].includes(P[pas[k]])));if(!rel){unexpl++;if(lines.length<60)lines.push('UNEXPLAINED DROP '+key+' '+p+': live '+lc[i]+', candidate '+nc[i]);}}});
     lo.forEach((c,k)=>{if(no[k]<c){unexpl++;if(lines.length<60)lines.push('OTHER SIDE DROP '+key+' O'+k+': live '+c+', candidate '+no[k]);}});
    }}console.log('PROGRESS '+side+' pc '+pc+' cases '+total+' '+new Date().toISOString());}}
 const SHN=(process.env.SHARD||'0/1').replace('/','of');fs.writeFileSync('pkgQRD/w1_grade/matrix_live_counts_'+SHN+'.txt',Object.entries(liveTab).map(([k,v])=>k+' => '+v).join('\n')+'\n');
 if(MODE==='live'){fs.writeFileSync('/dev/null',Object.entries(liveTab).map(([k,v])=>k+' => '+v).join('\n')+'\n');console.log('live cases '+total);return;}
 lines.forEach(l=>console.log(l));console.log('cases '+total+'; LOSS '+loss+'; intended drops (cand>=1, a related judge redirected) '+(drop-unexpl+0)+'; unexplained drops '+unexpl);
 console.log(loss===0&&unexpl===0?'MATRIX OK':'MATRIX FAIL');})().catch(e=>console.log('ERROR '+e.stack));
