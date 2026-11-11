const fs=require('fs'),crypto=require('crypto');const P='/mnt/project-files/wall2024/';const f=n=>JSON.parse(fs.readFileSync(P+n,'utf8'));
const s120=f('fetchback_live_s120.json'),s123=f('fetchback_live_s123.json');const R='Close Enforcer Record';
const tot=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
for(const [src,out] of [['parent_s120_CLG.json','parent_s123_CLG.json'],['parent_s120_CLG_CDX.json','parent_s123_CLG_CDX.json']]){const p=f(src);
 const other=p.nodes.filter(n=>n.name!==R).every(n=>JSON.stringify(n)===JSON.stringify(s120.nodes.find(z=>z.name===n.name)))&&JSON.stringify(p.connections)===JSON.stringify(s120.connections)&&p.nodes.length===s120.nodes.length;
 const o=JSON.parse(JSON.stringify(s123));o.nodes.find(n=>n.name===R).parameters.jsCode=p.nodes.find(n=>n.name===R).parameters.jsCode;
 const s=JSON.stringify(o);fs.writeFileSync(P+out,s);
 const diff=o.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(s123.nodes.find(z=>z.name===n.name))).map(n=>n.name);
 console.log(src,'-> only record differs from s120:',other,'|',out,'differs from s123 in:',diff.join(','),'| code vs s123',tot(o)-tot(s123),'| vs s120 parent',tot(p)-tot(s120),'| sha',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));}
const R123=s123.nodes.filter(n=>/Close Enforcer Record/.test(n.parameters.jsCode||'')).map(n=>n.name);console.log('s123 nodes naming the record:',R123.join(' ; '));
