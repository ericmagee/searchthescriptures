// W2: luna's send-back keystone derivation under pkgECB / ALL, with a planted send-back reply (her stored reply minus the lines for items ECB no longer sends).
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),ECB:L('pkgKSR/parent_s110_ECB.json'),ALL:L('pkgKSR/parent_s110_ALL.json'),KSR:L('pkgKSR/parent_s110_KSR.json')};
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');const W2=a=>[a.map(j=>({json:j}))];
const der=o=>[...nt(o).matchAll(/KEYSTONE: D6 -- (STANDS|BROKEN) -- derived by the engine/g)].length;
const ks=o=>[...nt(o).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').matchAll(/(?:^|\n|")\s*KEYSTONE: D6 -- (STANDS|BROKEN)[^\n"\\]{0,60}/g)].map(m=>m[0].trim().slice(0,70));
const seatKS=o=>o[0].bodies.map((b,i)=>{const t=String(b).replace(/\\n/g,'\n');const m=[...t.matchAll(/(?:^|\n|")\s*KEYSTONE: D6 -- (STANDS|BROKEN)( -- derived)?/g)].map(x=>x[1]+(x[2]?' (derived)':''));return (o[0].summary&&o[0].summary[i]?o[0].summary[i].seat:i)+': '+m.join('/');});
(async()=>{
 const chain=async(set,plant)=>{const over={};const o=async n=>{const r=await run(src(set,n),n,RD,over);if(r.err)throw new Error(n+': '+r.err);over[n]=W2(r);return r;};
  if(set!=='s110')await o('Panel Cure Check');const sbb=await o('Send Back Build');
  if(plant){const old=RD['Send Back Build'][0].data.main[0].map(x=>x.json),call=RD['Send Back Call openrouter'][0].data.main[0];
   const key=i=>i.rule+'|'+i.item+'|'+i.line;const out=[];
   sbb.forEach((j,k)=>{const oj=old.find(x=>x.seat===j.seat);const sc=call.find(c=>c.json&&c.json.choices&&old.indexOf(oj)===call.indexOf(c))||call[old.indexOf(oj)];
    const map={};(oj.items||[]).forEach(i=>{const n=(j.items||[]).find(x=>key(x)===key(i));if(n)map[i.sid]=n.sid;});
    const t=sc.json.choices[0].message.content;let lines;if(/^\s*\{/.test(t)){lines=[t.replace(/SENDBACK: (S\d+) \|\|/g,(a,s)=>'SENDBACK: '+(map[s]||'S0')+' ||')];}else{lines=t.split('\n').filter(l=>{const m=l.match(/^SENDBACK: (S\d+) \|\|/);return !m||map[m[1]];}).map(l=>l.replace(/^SENDBACK: (S\d+) \|\|/,(a,s)=>'SENDBACK: '+map[s]+' ||'));}
    const nj=JSON.parse(JSON.stringify(sc.json));nj.choices[0].message.content=lines.join('\n');out.push({json:nj});
    console.log('   plant',j.seat,'stored SENDBACK marks',(t.match(/SENDBACK: S\d+/g)||[]).length,'planted',(lines.join('\n').match(/SENDBACK: S[1-9]\d*/g)||[]).length,'map',JSON.stringify(map));});
   over['Send Back Call openrouter']=[out];}
  await o('Send Back Record');await o('Reread Build');await o('Reread Record');await o('Gate Build');await o('Gate Record');const m=await o('Alternate Merge Seat');return m;};
 const base=await chain('s110',false);console.log('s110 stored chain: derived D6 lines',der(base),'equal to stored Alternate Merge Seat:',nt(base)===nt(RD['Alternate Merge Seat'][0].data.main[0].map(x=>x.json)));
 for(const s of ['ECB','ALL']){try{const m=await chain(s,true);console.log(s,'planted: derived D6 lines',der(m),'| per seat',JSON.stringify(seatKS(m)));}catch(e){console.log(s,'ERROR',e.message.slice(0,300));}}
 console.log('s110 per seat',JSON.stringify(seatKS(base)));
})();
;(async()=>{const over={};const o=async(set,n)=>{const r=await run(src(set,n),n,RD,over);if(r.err)throw new Error(n+': '+r.err);over[n]=W2(r);return r;};
 try{for(const n of ['Panel Cure Check','Send Back Build','Send Back Record','Reread Build','Reread Record','Gate Build','Gate Record','Alternate Merge Seat'])await o('KSR',n);
 console.log('KSR stored replies, Alternate Merge Seat per seat',JSON.stringify(seatKS(over['Alternate Merge Seat'][0].map(x=>x.json))));
 const sr=over['Send Back Record'][0].map(x=>x.json);console.log('KSR Send Back Record keys',Object.keys(sr[0]).slice(0,20).join(','));
 }catch(e){console.log('KSR chain ERROR',e.message.slice(0,300));}})();
