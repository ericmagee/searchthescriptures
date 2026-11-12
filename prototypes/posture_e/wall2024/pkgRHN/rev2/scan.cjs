// Scan stored round texts: for each of the first three non-empty lines naming a round, does live / rev1 / rev2 treat it as a heading?
const fs=require('fs');let t=fs.readFileSync(process.argv[2],'utf8');try{t=JSON.parse(t).result}catch(e){}
let rows=JSON.parse(t.slice(t.indexOf("[{"),t.lastIndexOf("}]")+2));if(rows[0]&&rows[0].json_agg)rows=rows[0].json_agg;
const RE=/^([ \t#*_>-]*)(.*?\bRound\s+)(\d)\b(\s*\((?:close|closing|close round|link round|link)\)|\s*[-–—:]?\s*(?:close|closing)\b(?:\s+round)?)?(.*)$/i;
const get=f=>{const c=fs.readFileSync(f,'utf8');const n=JSON.parse(c).nodes.find(n=>n.name==='D1 Extract').parameters.jsCode;const i=n.indexOf('if(!h||');return n.slice(i,n.indexOf('continue;',i)+9);};
const mk=cond=>new Function('L','i','h','{'+cond+' return true;} return false;'.replace('{','').replace(/^/,'')) ;
const conds={live:get('/mnt/project-files/wall2024/fetchback_live_s156.json'),rev1:get('/mnt/project-files/wall2024/parent_s156_RHN.json'),rev2:get('/mnt/project-files/wall2024/parent_s156_RHN2.json')};
const F={};for(const k in conds)F[k]=new Function('L','i','h','for(let _=0;_<1;_++){'+conds[k]+'return true;}return false;');
const out={total:0,acc:{live:0,rev1:0,rev2:0}},lists={rev2acc:[],liveOnly:[],rev1notRev2:[]};
for(const r of rows){const L=String(r.v||'').replace(/^\s*(?:DEFENDER|CHALLENGER) \([^)]*\) -- ROUND \d, [^\n]*\n/,'').split('\n');for(let i=0,k=0;i<L.length&&k<3;i++){if(!L[i].trim())continue;k++;const h=L[i].match(RE);if(!h)continue;out.total++;
 const d={};for(const x in F){d[x]=F[x](L,i,h);if(d[x])out.acc[x]++;}
 const s=r.id+' '+r.c+' | '+L[i].trim().slice(0,110);
 if(d.rev2)lists.rev2acc.push(s);if(d.live&&!d.rev2)lists.liveOnly.push(s);if(d.rev1&&!d.rev2)lists.rev1notRev2.push(s);}}
console.log(JSON.stringify(out));for(const k in lists){console.log('== '+k+' '+lists[k].length);for(const s of lists[k])console.log('  '+s);}
