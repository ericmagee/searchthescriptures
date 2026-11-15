// pkgDDF: debaters at default reasoning (operator 02:53 CST 11-15 "always run at default"; 02:57 "that was for judging").
// Removes the effort-low rule for hydrogen and meta/muse-spark-1.3 (operator 03:00 CST 11-15: run at default; never told to touch hydrogen); mimo and flash unchanged.
const fs=require('fs'),cr=require('crypto');const base=process.argv[2]||'wsp/fetchback_live_s210.json';
const d=JSON.parse(fs.readFileSync(base));const sha=s=>cr.createHash('sha256').update(s).digest('hex');
const R=[["if(/^(?:google\\/gemini-4-hydrogen|meta\\/muse-spark-1\\.3)$/.test(String(model))&&!o.reasoning)o.reasoning={effort:'low'};",""]];

const once=(s,a,b,t)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(t+' count '+k+': '+a.slice(0,50));return s.replace(a,()=>b);};
const rep=[];
for(const n of d.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c)continue;
 if(n.name==='Shared Library'){const iL=c.indexOf('\n/*LIB*/'),iM=c.lastIndexOf('\n/*MAP*/'),iE=c.lastIndexOf('\n/*END*/');const L=JSON.parse(c.slice(iL+8,iM)),M=JSON.parse(c.slice(iM+8,iE));
  const li=L.findIndex(x=>x.includes(R[0][0]));if(li<0)throw new Error('lib line');L[li]=once(L[li],R[0][0],R[0][1],'LIB h');
  
  const rb=m=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');let ch=0;for(const k of Object.keys(M)){const x=rb(M[k]).length;if(x!==M[k].n){M[k].n=x;ch++;}}
  const LJ=JSON.stringify(L);const hdr=c.slice(0,iL).replace(/library sha [0-9a-f]{16}, (\d+) lines/,(m,q)=>{if(+q!==L.length)throw new Error('lines');return 'library sha '+sha(LJ).slice(0,16)+', '+q+' lines';});
  const nc=hdr+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(iE);n.parameters.jsCode=nc;rep.push([n.name,c.length,nc.length,sha(nc).slice(0,12),'LIB line '+li+', MAP n changed '+ch]);continue;}
 if(!c.includes(R[0][0]))continue;
 let x=once(c,R[0][0],R[0][1],n.name+' h');n.parameters.jsCode=x;rep.push([n.name,c.length,x.length,sha(x).slice(0,12)]);}
fs.writeFileSync('wdf/target_ddf.json',JSON.stringify(d));for(const r of rep)console.log(r.join('\t'));console.log('nodes',rep.length);
