// pkgOWR rev 2 replay: OGR.harvest from the built D4 Build, run on stored 4-round debates: harvest(R) (live) vs harvest(R,true) (rev 2),
// defender rounds CR1-CR3 (claude_r1, claude_r2, engine_r3) and challenger rounds DR1-DR3 (engine_r1, engine_r2, challenger_r3, passed
// as CR1-CR3 the way C4 Build does). Also checks that the live harvest is unchanged by rev 2 when the flag is off.
// usage: node pkgOWR/replay_rev2.cjs <live parent> <built parent> <rows files...>
const fs=require('fs');const get=(p,nm)=>{const raw=JSON.parse(fs.readFileSync(p,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);return W.nodes.find(n=>n.name===nm).parameters.jsCode;};
const ogr=src=>{const i=src.indexOf('const OGR=(()=>{');const e=src.indexOf('return {harvest};})();',i);return new Function(src.slice(i,e+22)+';return OGR;')();};
const L=ogr(get(process.argv[2],'D4 Build')),N=ogr(get(process.argv[3],'D4 Build'));
let deb=0,same0=0,olds=0,lost=0,add=0,addCh=0;const ex=[];
for(const f of process.argv.slice(4)){const rt=JSON.parse(fs.readFileSync(f,'utf8')).result;const rows=JSON.parse(rt.slice(rt.indexOf('\n[')+1,rt.lastIndexOf(']')+1))[0].json_agg;
 for(const r of rows){deb++;for(const sd of ['D','C']){const R=sd==='D'?{CR1:r.CR1,CR2:r.CR2,CR3:r.CR3}:{CR1:r.DR1,CR2:r.DR2,CR3:r.DR3};
  const a=L.harvest(R),a2=N.harvest(R),b=N.harvest(R,true);if(JSON.stringify(a)===JSON.stringify(a2))same0++;
  const bt=new Set(b.map(x=>x.round+'|'+x.text));olds+=a.length;for(const x of a)if(!bt.has(x.round+'|'+x.text))lost++;
  const at=new Set(a.map(x=>x.round+'|'+x.text));for(const x of b)if(!at.has(x.round+'|'+x.text)){add++;addCh+=x.text.length+8;ex.push((r.tok||r.id)+' '+sd+' ['+(sd==='D'?x.round:x.round.replace('CR','DR'))+'] '+x.text);}}}}
console.log('debates',deb,'| sides',deb*2,'| flag off equals live',same0+'/'+(deb*2),'| live entries',olds,'lost',lost,'| added',add,'(~'+addCh+' prompt chars, about',Math.round(addCh/(deb*2)),'per close request)');
ex.forEach(x=>console.log('+ '+x));
