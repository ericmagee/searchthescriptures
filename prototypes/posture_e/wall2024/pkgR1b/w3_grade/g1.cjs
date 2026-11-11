// W3 second grade of R1b on s119: structure and size
const fs=require('fs'),cr=require('crypto');const g=f=>{const raw=fs.readFileSync(f);let d=JSON.parse(raw);d=d.data||d;return [d.workflow||d,cr.createHash('sha256').update(raw).digest('hex').slice(0,16)];};
const [A,ha]=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),[B,hb]=g('/mnt/project-files/wall2024/parent_s119_R1b.json');const S=JSON.stringify;console.log('sha',ha,hb,'nodes',A.nodes.length,B.nodes.length);
const by={};A.nodes.forEach(n=>by[n.name]=n);let code=[0,0],ch=[],other=0,miss=0;
for(const n of B.nodes){const a=by[n.name];if(!a){miss++;continue;}const ca=a.parameters.jsCode||'',cb=n.parameters.jsCode||'';code[0]+=ca.length;code[1]+=cb.length;if(ca!==cb)ch.push([n.name,ca.length,cb.length]);
 if(S({...n,parameters:{...n.parameters,jsCode:0}})!==S({...a,parameters:{...a.parameters,jsCode:0}}))other++;}
const {nodes:_a,...ra}=A,{nodes:_b,...rb}=B;const diffKeys=Object.keys({...ra,...rb}).filter(k=>S(ra[k])!==S(rb[k]));
console.log('code',code[0],code[1],code[1]-code[0],'| changed nodes',ch.length,'| non-code node differences',other,'| missing',miss,'| top-level keys differing',diffKeys.join(',')||'none');
ch.sort((x,y)=>y[1]-x[1]);for(const c of ch)console.log(' ',c.join(' | '));
const stub=B.nodes.find(n=>n.name===ch[ch.length-1][0]).parameters.jsCode;console.log('--- smallest-source stub:\n'+stub.slice(0,900));
