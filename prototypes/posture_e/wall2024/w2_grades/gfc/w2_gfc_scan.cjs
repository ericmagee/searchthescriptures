// G7 scan: gate replies with a FORCED text inside the CHANGE TO field (between "CHANGE TO:" and the reason "||"), in every stored gate reply.
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const out=[];let replies=0,lines=0;
const texts=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d:[d];return d.flatMap(r=>((r.data||{}).main||[]).flat().filter(Boolean).map(x=>(((x.json||{}).choices||[])[0]||{}).message).filter(Boolean).map(m=>m.content||''));};
const files=fs.readdirSync(D).filter(f=>/Gate_Call/.test(f)).map(f=>D+f);
const ex=fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f));
const all=files.map(f=>[f.split('/').pop(),texts(f)]);
for(const f of ex){try{const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));const RD=(X.data||X).resultData.runData;for(const n of Object.keys(RD).filter(n=>/Gate Call/.test(n)))all.push([f+':'+n,RD[n].flatMap(r=>((r.data||{}).main||[]).flat().filter(Boolean).map(x=>(((x.json||{}).choices||[])[0]||{}).message).filter(Boolean).map(m=>m.content||''))]);}catch(e){console.log('skip',f,e.message);}}
const forms={inChange:0,inReason:0,afterKeep:0};
for(const [f,ts] of all)for(const t0 of ts){replies++;const t=t0.replace(/\\n/g,'\n');for(const l of t.split('\n').filter(l=>/^\s*GATE\s*:/i.test(l))){lines++;const p=l.split('||');const ch=p.slice(1).find(x=>/CHANGE TO\s*:/i.test(x))||'';const rs=p.slice(2).join('||');
 if(/FORCED\s*:/i.test(ch)){forms.inChange++;out.push(f+' '+l.slice(0,90)+' ... '+ch.slice(ch.search(/FORCED\s*:/i),ch.search(/FORCED\s*:/i)+60));}
 if(/FORCED\s*:/i.test(rs)){forms.inReason++;out.push("REASON "+f+" "+rs.slice(0,400));}if(/\|\|\s*KEEP\b/i.test(l)&&/FORCED\s*:/i.test(l))forms.afterKeep++;}}
console.log('sources',all.length,'replies',replies,'GATE lines',lines,JSON.stringify(forms));out.forEach(x=>console.log('  ',x));
