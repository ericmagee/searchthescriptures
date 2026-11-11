// pkgOON3 builder's test (W3): live s115 against parent_s116_OON3.json on the stored rounds and replies of 34726.
const fs=require('fs');process.chdir(__dirname+'/..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+(process.argv[2]||'parent_s116_OON3.json'));
const load=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);const c={};return n=>c[n]||(c[n]=rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode));};const LIVE=load(A),CAND=load(B);
// diff
const dn=B.nodes.filter(n=>S(n)!==S(A.nodes.find(x=>x.name===n.name))).map(n=>n.name+' '+(n.parameters.jsCode.length-A.nodes.find(x=>x.name===n.name).parameters.jsCode.length));const {nodes:_1,...ra}=A,{nodes:_2,...rb}=B;
console.log('DIFF nodes:',dn.join('; '),'| nodes',A.nodes.length,B.nodes.length,'| rest equal',S(ra)===S(rb));
const M=Object.keys(JSON.parse((c=>c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))(A.nodes.find(n=>n.name==='Shared Library').parameters.jsCode)));
const ch=M.filter(n=>{try{return LIVE(n)!==CAND(n);}catch(e){return false;}});console.log('library-read nodes whose rebuilt source differs:',ch.length,'|',ch.join(', '));
const ex=JSON.parse(fs.readFileSync(W+'ex34726_full.json','utf8'));const r=(ex.data||ex).resultData.runData;const base={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];base[n]=(last&&last.data&&last.data.main)||null;}
const J=o=>JSON.parse(S(o));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0');
const store=edit=>{const o=Object.assign({},base);for(const [n,f] of Object.entries(edit||{})){o[n]=J(base[n]);f(o[n]);}return o;};
const run=async(src,node,inp,st)=>(await H.run(src(node),'x34726',inp,mk(st))).map(x=>x.json);
module.exports={LIVE,CAND,run,store,base,J,T,S,A,B};
if(require.main===module)(async()=>{
 // T1 stored replay, no plant: every changed node equal live against candidate on stored 34726
 const inp={'Gate Build':'Reread Record','Judge Enforcer Build':null,'Send Back Build':'Judge Enforcer Record'};
 for(const [node,i] of [['Gate Build','Reread Record'],['Send Back Build','Judge Enforcer Record']]){const a=await run(LIVE,node,i,store()),b=await run(CAND,node,i,store());console.log('T1',node,'stored 34726, candidate equals live:',T(S(a))===T(S(b)));}
 // T2 the applier: answers on luna's out-of-round item S12
 const plant=(sid,to)=>({'Send Back Record':o=>{const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===sid);if(!x)throw new Error('no '+sid);x.ans='CHANGE';x.to=to;}});
 const f=(arr,sid)=>{const it=arr[0].items.find(x=>x.sid===sid);return it?it.kind+': '+String(it.why).slice(0,50):'no gate item (applied)';};
 for(const to of ['OUT-OF-ROUND CONCESSIONS: NONE','OUT-OF-ROUND CONCESSIONS : none.','(OUT-OF-ROUND CONCESSIONS: NONE)','out-of-round concessions: STRUCK -- not in the round','OUT-OF-ROUND CONCESSIONS:','OUT-OF-ROUND CONCESSIONS: NONETHELESS it stands','OUT-OF-ROUND CONCESSIONS: DEFENDER | [CR2] | "None of the titles gives a knowing."','CONCEDED LINKS: NONE','NONE','STRUCK','KEEP']){
  const st=store(plant('S12',to));const a=await run(LIVE,'Gate Build','Reread Record',st),b=await run(CAND,'Gate Build','Reread Record',st);
  console.log('T2',S(to).slice(0,60),'| LIVE:',f(a,'S12'),'| CAND:',f(b,'S12'),'| other seats equal',S(a.slice(1))===S(b.slice(1)),'| other luna items equal',S(a[0].items.filter(x=>x.sid!=='S12'))===S(b[0].items.filter(x=>x.sid!=='S12')));}
})();
