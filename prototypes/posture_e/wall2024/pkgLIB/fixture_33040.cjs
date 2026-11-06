// pkgLIB v2: adds the 33040 node outputs saved after the first fixture (inputs/33040_index_w1.json, 17:40 CST: Alt Send Back Record, Alt Seated,
// Resolve Seats, Panel Check, Build Independent Verdict) to pkgLIB/fixtures/nodes_33040_full.json.gz, so more of the 22 nodes run whole and every
// stub that reads another node is exercised. Run from wall2024/: node pkgLIB/fixture_33040.cjs
const fs=require('fs'),zlib=require('zlib');const FX='pkgLIB/fixtures/nodes_33040_full.json.gz',IN='/mnt/project-files/wall2024/inputs/';
const N=JSON.parse(zlib.gunzipSync(fs.readFileSync(FX)));const IX=JSON.parse(fs.readFileSync(IN+'33040_index_w1.json','utf8'));const add=[];
for(const [name,v] of Object.entries(IX.nodes)){if(N.nodes[name])continue;const runs=JSON.parse(fs.readFileSync(IN+v.file,'utf8'));
 N.nodes[name]=runs.map(r=>((r.main||[])[0]||[]).map(i=>i.json));add.push(name+' ('+N.nodes[name].map(a=>a.length).join(',')+' items)');}
if(add.length){N.sources+=' + inputs/33040_index_w1.json ('+Object.keys(IX.nodes).join(', ')+')';fs.writeFileSync(FX,zlib.gzipSync(JSON.stringify(N)));}
console.log(add.length?'added: '+add.join('; '):'nothing to add');
