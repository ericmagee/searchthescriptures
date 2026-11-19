// ASK 445: one revert file per package of the 06:37Z stack (443, 444 A2, 455 A-C, 456). Base engine 7cd61791, child e9a13846.
// Each changed node's text is stored as unique (package text -> base text) hunks, so a revert restores only that package's own text.
// Engine base = the value the other three package targets share (no node is changed by two packages).
// Child: only 455 and 456 touch it; 455's child target holds base R2 nodes and 456's holds the base library, asserted below
// by the child library diff (455 vs 456) equalling the engine library diff (455 vs base) hunk for hunk.
const fs=require('fs'),z=require('zlib'),cr=require('crypto');
const rd=p=>{let w=JSON.parse(z.gunzipSync(fs.readFileSync(p)));if(w.data&&w.data.nodes)w=w.data;return w;};
const md5=s=>cr.createHash('md5').update(s).digest('hex');
const ENG={'443':'a443_w4/t443_eng.json.gz','444 A2':'a444_w4/t444a2_eng.json.gz','455':'a455_w4/t455_eng.json.gz','456':'a8456_w2/engine_target.json.gz'};
const C5=rd('a455_w4/t455_child.json.gz'),C6=rd('a8456_w2/child_target.json.gz');
const txt=n=>n.type==='n8n-nodes-base.code'?n.parameters.jsCode:JSON.stringify(n.parameters);
const grow=(pk,s,e)=>{while(e-s<40||pk.split(pk.slice(s,e)).length!==2){s=Math.max(0,s-20);e=Math.min(pk.length,e+20);if(s===0&&e===pk.length)break;}return [s,e];};
const hunks=(base,pk)=>{let raw=[];
  if(base.length===pk.length){let i=0;while(i<pk.length){if(base[i]!==pk[i]){let j=i;while(j<pk.length&&base[j]!==pk[j])j++;raw.push([i,j,i,j]);i=j;}else i++;}}
  else{let a=0;while(a<base.length&&a<pk.length&&base[a]===pk[a])a++;let e=0;while(e<base.length-a&&e<pk.length-a&&base[base.length-1-e]===pk[pk.length-1-e])e++;raw.push([a,pk.length-e,a,base.length-e]);}
  let Wn=raw.map(([ps,pe,bs,be])=>{const [s,e]=grow(pk,ps,pe);return [s,e,bs-(ps-s),be+(e-pe)];});
  for(let m=true;m;){m=false;for(let i=0;i+1<Wn.length;i++)if(Wn[i][1]>=Wn[i+1][0]){const [s,e]=grow(pk,Wn[i][0],Wn[i+1][1]);Wn.splice(i,2,[s,e,Wn[i][2]-(Wn[i][0]-s),Wn[i+1][3]+(e-Wn[i+1][1])]);m=true;break;}}
  const H=Wn.map(([s,e,bs,be])=>({pkg_text:pk.slice(s,e),base_text:base.slice(bs,be)}));
  let t=pk;for(const h of H){if(t.split(h.pkg_text).length!==2)throw new Error('hunk not unique');t=t.replace(h.pkg_text,()=>h.base_text);}
  if(t!==base)throw new Error('hunks do not rebuild base');return H;};
const out={};const add=(k,who,n,base,pk)=>{out[k]=out[k]||{ask:k,stack_card:'Write all four, 06:37:05Z 11-19',base:{engine:'7cd61791',child:'e9a13846'},after:{engine:'c1256eec',child:'cd11b411'},restore:[]};
  if(base===null){out[k].restore.push({workflow:who,node:n.name,action:'remove node',pkg_md5:md5(pk)});return;}
  out[k].restore.push({workflow:who,node:n.name,action:'replace text',field:n.type==='n8n-nodes-base.code'?'jsCode':'parameters(JSON)',pkg_md5:md5(pk),base_md5:md5(base),hunks:hunks(base,pk)});};
const W=Object.fromEntries(Object.entries(ENG).map(([k,p])=>[k,rd(p)]));const ks=Object.keys(W);
const names=new Set([].concat(...ks.map(k=>W[k].nodes.map(n=>n.name))));
for(const nm of names){const v=Object.fromEntries(ks.map(k=>{const n=W[k].nodes.find(n=>n.name===nm);return [k,n?txt(n):null];}));
  for(const k of ks){const o=ks.filter(x=>x!==k);if(o.some(x=>v[x]!==v[o[0]]))continue;if(v[k]===v[o[0]])continue;add(k,'engine',W[k].nodes.find(n=>n.name===nm),v[o[0]],v[k]);}}
const a=W['443'].connections,b=W['444 A2'].connections;const ch={};for(const c of new Set([...Object.keys(a),...Object.keys(b)]))if(JSON.stringify(a[c])!==JSON.stringify(b[c]))ch[c]={pkg:a[c]||null,base:b[c]||null};
out['443'].connections=ch;for(const k of ['444 A2','455','456'])if(JSON.stringify(W[k].connections)!==JSON.stringify(b))throw new Error(k+' connections differ from base');
const eh=out['455'].restore.find(r=>r.node==='Shared Library').hunks;
const g=(w,n)=>txt(w.nodes.find(x=>x.name===n));
const chh=hunks(g(C6,'Shared Library'),g(C5,'Shared Library'));
if(JSON.stringify(chh)!==JSON.stringify(eh))throw new Error('child library diff differs from the engine library diff');
add('455','child',C5.nodes.find(n=>n.name==='Shared Library'),g(C6,'Shared Library'),g(C5,'Shared Library'));
for(const nm of ['R2 Alt Send Back Record','R2 Alternate Payloads'])add('456','child',C6.nodes.find(n=>n.name===nm),g(C5,nm),g(C6,nm));
const cn=x=>JSON.stringify(x.connections);if(cn(C5)!==cn(C6))throw new Error('child connections differ');
for(const n of C5.nodes){if(['Shared Library','R2 Alt Send Back Record','R2 Alternate Payloads'].includes(n.name))continue;if(g(C5,n.name)!==g(C6,n.name))throw new Error('child node '+n.name+' differs');}
for(const k in out){const f='p440_w2/revert445/revert_'+k.replace(/ /g,'')+'.json';fs.writeFileSync(f,JSON.stringify(out[k],null,1));console.log(f,'|',out[k].restore.map(r=>r.workflow+':'+r.node+' ('+(r.hunks?r.hunks.length+' hunk(s), '+r.hunks.map(h=>h.pkg_text.length+'->'+h.base_text.length).join(','):r.action)+')').join('; '),out[k].connections&&Object.keys(out[k].connections).length?'| connections '+Object.keys(out[k].connections).join(','):'');}
