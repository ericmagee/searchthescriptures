const fs=require('fs'),zlib=require('zlib');
const NEW=JSON.parse(fs.readFileSync('target_324.json')).nodes;const s=NEW.find(n=>n.name==='C1 Extract').parameters.jsCode;
const i=s.indexOf('const L2C=(()=>{');const j=s.indexOf('return {tags',i);const L=new Function(s.slice(i,s.indexOf('})();',j)+5)+'\nreturn L2C;')();
const H=s.slice(s.indexOf('function __gLab'),s.indexOf('/* pkgGLB'));const F=new Function('tagWords',H+';return {__gLab,__gCit};')(L.tagWords);
const R=JSON.parse(zlib.gunzipSync(fs.readFileSync('../gw/prototypes/posture_e/wall2024/r383/data/rounds8.json.gz')));let n=0;
for(const d of R){const t=d.challenger_r4||'';const GL=F.__gLab(t);for(const m of t.matchAll(/\[L2\][^\n]*/g)){for(const x of m[0].matchAll(/\bG0*(\d{1,5})\b/g)){const w='G'+x[1];if(!GL.has(w))continue;const cit=F.__gCit(m[0],x.index);n++;console.log(d.id.slice(0,8),w,cit?'CITE-KEPT':'skip','| ...'+m[0].slice(Math.max(0,x.index-45),x.index+8).replace(/\n/g,' '));}}}
console.log('label-number tokens on [L2] lines:',n);
