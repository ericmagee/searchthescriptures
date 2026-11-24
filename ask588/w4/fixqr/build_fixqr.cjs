// ASK 588 fix (W4): the question round's transcript anchor. Panel Build's transcript starts "=== TOPIC ===", so
// "DEBATE TRANSCRIPT\n\n=== [" never matches and every judge body is skipped. The anchor becomes "DEBATE TRANSCRIPT\n\n=== ".
// Touches QR Merge, QR Follow Build, QR Follow Final only. usage: node build_fixqr.cjs <engine in> <engine out>
const fs=require('fs');const [i,o]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(i,'utf8'));
const OLD="const QR_AT='DEBATE TRANSCRIPT\\n\\n=== [';",NEW="const QR_AT='DEBATE TRANSCRIPT\\n\\n=== ';";
for(const name of ['QR Merge','QR Follow Build','QR Follow Final']){const n=W.nodes.find(x=>x.name===name);const s=n.parameters.jsCode;const k=s.split(OLD).length-1;if(k!==1)throw new Error(name+': anchor occurs '+k+' times');n.parameters.jsCode=s.replace(OLD,()=>NEW);console.log(name,'changed');}
fs.writeFileSync(o,JSON.stringify(W));
