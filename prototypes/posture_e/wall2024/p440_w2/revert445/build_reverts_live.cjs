// ASK 445 fresh reverts for 455 and 456 against live engine e0a61271 / child 4982c042 (a475_w4 fetchback).
// Each node: the package's own hunks (from revert_455.json / revert_456.json) applied to the live text; the Shared Library header sha
// is recomputed for the reverted library (sha256 of JSON(L), first 16 hex, as build475), not restored to 4d19497f.
// usage (from wall2024/): node p440_w2/revert445/build_reverts_live.cjs
const fs=require('fs'),z=require('zlib'),cr=require('crypto');const T=require('../../tools/lib.cjs');
const rd=p=>{let w=JSON.parse(z.gunzipSync(fs.readFileSync(p)));if(w.data&&w.data.nodes)w=w.data;return w;};
const md5=s=>cr.createHash('md5').update(s).digest('hex');const sha=L=>cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
const LIVE={engine:rd('a475_w4/fetchback_w475_engine.json.gz'),child:rd('a475_w4/fetchback_w475_child.json.gz')};
const ver={engine:LIVE.engine.versionId.slice(0,8),child:LIVE.child.versionId.slice(0,8)};
const txt=n=>n.type==='n8n-nodes-base.code'?n.parameters.jsCode:JSON.stringify(n.parameters);
const grow=(pk,s,e)=>{while(e-s<40||pk.split(pk.slice(s,e)).length!==2){s=Math.max(0,s-20);e=Math.min(pk.length,e+20);if(s===0&&e===pk.length)break;}return [s,e];};
const hunks=(base,pk)=>{let raw=[];
  if(base.length===pk.length){let i=0;while(i<pk.length){if(base[i]!==pk[i]){let j=i;while(j<pk.length&&base[j]!==pk[j])j++;raw.push([i,j,i,j]);i=j;}else i++;}}
  else{let a=0;while(a<base.length&&a<pk.length&&base[a]===pk[a])a++;let e=0;while(e<base.length-a&&e<pk.length-a&&base[base.length-1-e]===pk[pk.length-1-e])e++;raw.push([a,pk.length-e,a,base.length-e]);}
  let Wn=raw.map(([ps,pe,bs,be])=>{const [s,e]=grow(pk,ps,pe);return [s,e,bs-(ps-s),be+(e-pe)];});
  for(let m=true;m;){m=false;for(let i=0;i+1<Wn.length;i++)if(Wn[i][1]>=Wn[i+1][0]){const [s,e]=grow(pk,Wn[i][0],Wn[i+1][1]);Wn.splice(i,2,[s,e,Wn[i][2]-(Wn[i][0]-s),Wn[i+1][3]+(e-Wn[i+1][1])]);m=true;break;}}
  const H=Wn.map(([s,e,bs,be])=>({pkg_text:pk.slice(s,e),base_text:base.slice(bs,be)}));
  let t=pk;for(const h of H){if(t.split(h.pkg_text).length!==2)throw new Error('hunk not unique');t=t.replace(h.pkg_text,()=>h.base_text);}
  if(t!==base)throw new Error('hunks do not rebuild');return H;};
const libsha={};
for(const k of ['455','456']){const R=JSON.parse(fs.readFileSync('p440_w2/revert445/revert_'+k+'.json'));
  const out={ask:k,from_revert:'revert_'+k+'.json (stack base 7cd61791 / e9a13846)',live:ver,restore:[]};
  for(const x of R.restore){const w=LIVE[x.workflow];const n=w.nodes.find(n=>n.name===x.node);if(!n)throw new Error(x.node+' not in live');const t=txt(n);let nt=t;
    for(const h of x.hunks){if(/library sha [0-9a-f]{16}/.test(h.pkg_text))continue;const c=nt.split(h.pkg_text).length-1;if(c!==1)throw new Error(k+' '+x.workflow+' '+x.node+': package hunk found '+c+' times in live');nt=nt.replace(h.pkg_text,()=>h.base_text);}
    if(x.node==='Shared Library'){const U=T.unpack({nodes:[{name:'Shared Library',parameters:{jsCode:nt}}]});
      for(const [nm,m] of Object.entries(U.M))if(T.rb(U.L,m).length!==m.n)throw new Error('MAP '+nm+' length moves');
      const L0=T.unpack(w).L;const moved=L0.map((l,i)=>l!==U.L[i]?i:-1).filter(i=>i>=0);
      const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,c)=>'library sha '+sha(U.L)+', '+c+' lines');if(h2===U.hdr)throw new Error('header not rewritten');
      nt=nt.replace(U.hdr,()=>h2);libsha[x.workflow]={live:sha(L0),reverted:sha(U.L),lines_changed:moved};}
    if(nt===t)throw new Error(x.node+': nothing to revert');
    out.restore.push({workflow:x.workflow,node:x.node,action:'replace text',field:x.field,pkg_md5:md5(t),base_md5:md5(nt),hunks:hunks(nt,t)});}
  const f='p440_w2/revert445/revert_'+k+'_'+ver.engine+'.json';fs.writeFileSync(f,JSON.stringify(out,null,1));
  console.log(f,'|',out.restore.map(r=>r.workflow+':'+r.node+' ('+r.hunks.length+' hunk(s))').join('; '));}
if(libsha.engine.reverted!==libsha.child.reverted)throw new Error('engine and child library sha differ after revert');
console.log('library sha after the 455 revert:',JSON.stringify(libsha));
