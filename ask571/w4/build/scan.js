const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/fairjudge/w4build/base_engine.json'));
for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(!s||s.indexOf('const L2C=')<0)continue;
const i=s.indexOf('const L2C=');const pre=s.slice(Math.max(0,i-80),i).replace(/\n/g,'\\n');
// find end: look for "})();" after? print line count & what follows
const lineStart=s.lastIndexOf('\n',i)+1;const line=s.slice(lineStart,s.indexOf('\n',i)<0?s.length:s.indexOf('\n',i));
console.log(x.name.padEnd(34),'len',s.length,'L2Cline',line.length,md5(line),'| starts:',line.slice(0,60).replace(/\n/g,' '),'| ends:',line.slice(-60));}
