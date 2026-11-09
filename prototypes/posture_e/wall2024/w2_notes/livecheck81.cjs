// W2 live check for manual v93 parts: is each W2 package's added text in live s81 (node code + unpacked library strip_XKB2)?
const fs=require('fs'),cp=require('child_process');const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s81.json','utf8'));let w=d.data||d;w=w.workflow||w;
const code={};for(const n of w.nodes)code[n.name.replace(/ /g,'_')]=(n.parameters&&(n.parameters.jsCode||JSON.stringify(n.parameters)))||'';
for(const f of fs.readdirSync('pkgLIB/strip_XKB2/patched'))code['LIB:'+f.replace(/\.js$/,'')]=fs.readFileSync('pkgLIB/strip_XKB2/patched/'+f,'utf8');
const all=Object.values(code).join('\n');
const pk=process.argv.slice(2);
for(const p of pk){const files=[];const walk=x=>{for(const f of fs.readdirSync(x)){const q=x+'/'+f;if(fs.statSync(q).isDirectory()){if(!/node_modules|\.git/.test(f))walk(q);}else if(/\/patched\/[^/]+\.js$/.test(q))files.push(q);}};
 try{walk(p);}catch(e){console.log(p,'missing');continue;}
 let hit=0,tot=0;const miss=[];
 for(const q of files){const bq=q.replace('/patched/','/base/');const P=fs.readFileSync(q,'utf8');const B=fs.existsSync(bq)?fs.readFileSync(bq,'utf8'):'';
  let i=0;while(i<P.length&&P[i]===B[i])i++;if(i>=P.length)continue;const snip=P.slice(i,i+50);tot++;if(all.includes(snip))hit++;else miss.push(q.split('/').pop());}
 console.log(p.padEnd(18),tot?`${hit}/${tot}`:'no patched', miss.length?'miss '+miss.slice(0,4).join(','):'');}
