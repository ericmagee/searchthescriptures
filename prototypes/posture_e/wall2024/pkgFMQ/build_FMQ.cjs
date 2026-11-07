// pkgFMQ (W3 Wall 2903; Eric's screenshot of the 33389 report). Report fix, 1 node (Format Markdown). Gates nothing.
// seatReason read the RESULT reason up to the first '"', so an escaped quote (\") inside the JSON string cut it: gemini 33389 printed
// 'The record shows that Mary \'. Escaped quotes are now held aside while the reason is read, so only a real end of the string or line stops it.
// Base: live s45 (Format Markdown is not in any gap package). Run from wall2024/: node pkgFMQ/build_FMQ.cjs [--out dir]
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const OUT=arg('--out',__dirname+'/patched');fs.mkdirSync(OUT,{recursive:true});
const W=JSON.parse(fs.readFileSync(arg('--base','/mnt/project-files/wall2024/fetchback_live_s45.json'),'utf8'));const s0=W.nodes.find(z=>z.name==='Format Markdown').parameters.jsCode;
const A0=`const seatReason = raw => { const m = String(raw || '').replace(/\\\\n/g, '\\n').match(/RESULT[ \\t*_]*:[ \\t*_]*(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[ \\t*_]*(?:--|—|–)[ \\t]*([^\\n"]+)/); return m ? m[1].replace(/\\\\"/g, '"').trim() : null; };`;
const A1=`const seatReason = raw => { const m = String(raw || '').replace(/\\\\n/g, '\\n').replace(/\\\\+"/g, '\\u0001').match(/RESULT[ \\t*_]*:[ \\t*_]*(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[ \\t*_]*(?:--|—|–)[ \\t]*([^\\n"]+)/); return m ? m[1].replace(/\\u0001/g, '"').trim() : null; }; /* pkgFMQ (W3 2903): an escaped quote no longer ends the reason */`;
const c=s0.split(A0).length-1;if(c!==1)throw new Error('anchor x'+c);const s=s0.replace(A0,()=>A1);new Function('$','$input','$json','$execution','$workflow','$node','$items',s);
fs.writeFileSync(OUT+'/Format_Markdown.js',s);const plan={source:'W2 pkgFMQ',nodes:[{name:'Format Markdown',base:'live s45',base_sha:sha(s0),final_sha:sha(s)}]};fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('Format Markdown '+sha(s0)+'->'+sha(s));
