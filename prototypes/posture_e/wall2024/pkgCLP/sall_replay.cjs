const fs=require('fs');
const gr=(f,patch)=>{const w=JSON.parse(fs.readFileSync(f));const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;
 const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
 let src=M['Alt Gate Record'].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n");
 if(patch){const a=src.indexOf('/* pkgOAD');const s=src.lastIndexOf('to=to.replace(',a);src=src.slice(0,s)+patch+src.slice(s);}
 const L=src.split('\n');const k=L.findIndex(l=>/\$\('/.test(l));return new Function('$input','$',L.slice(0,k).join('\n')+'\nreturn {sbApply2024};')({all:()=>[]},()=>({first:()=>({json:{}}),all:()=>[]}));};
const j=JSON.parse(fs.readFileSync(__dirname+'/agr_35856.json'));const G=j.data.resultData.runData["Alt Gate Record"][0].data.main[0][0].json;
const B=G.bodies.map(s=>typeof s==="string"?JSON.parse(s):s)[0];const p=B.payload;const raw=p.verdict_raw;
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
const its=G.sb_items.filter(x=>x.seat==="grok");
const PATCH=process.argv[3]||'';
for(const [nm,M] of [['live',gr(process.argv[2])],['patched',gr(process.argv[2],PATCH)]]){const R=M.sbApply2024('grok',raw,Object.assign({},F),its,null);
 const hh=String(R.text).split('\n').filter(l=>/^\s*DEFENDER \| \[CR4\].*so I do not rest the source/.test(l));console.log(nm,'ROWS',JSON.stringify(hh));const base=raw.split('\n'),now=String(R.text).split('\n');console.log(nm,'items',JSON.stringify((R.items||[]).map(x=>x.kind+': '+x.why)),'\n  added',JSON.stringify(now.filter(l=>!base.includes(l)).map(l=>l.slice(0,160))),'\n  removed',JSON.stringify(base.filter(l=>!now.includes(l)).map(l=>l.slice(0,160))),'\n  fields',JSON.stringify(R.fields));}
