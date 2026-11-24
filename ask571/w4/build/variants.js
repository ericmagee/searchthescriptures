const fs=require('fs');const {cut,md5}=require('./cutl2c.js');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/fairjudge/w4build/base_engine.json'));
const get=n=>cut(W.nodes.find(x=>x.name===n).parameters.jsCode).st;
fs.mkdirSync('var',{recursive:true});
for(const n of ['C1 Extract','D2 Build','Citation Scan','Quote Report','D2 Lexicon Plan','L2 Lexicon Plan','L2 Count Plan'])fs.writeFileSync('var/'+n.replace(/ /g,'_')+'.js',get(n).split(/(?<=;)(?=\s*(?:const |function |return ))/).join('\n'));
const T=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const k=L.findIndex(l=>l.indexOf('const L2C=(()=>{')>=0);console.log('LIB line',k,'of',L.length,'MAP keys',Object.keys(M).join(','));
// which MAP keys reference line k?
for(const [key,v] of Object.entries(M)){if(!v.p)continue;for(const e of v.p){if(e===k||(Array.isArray(e)&&typeof e[0]==='number'&&e[0]<=k&&k<=e[1]))console.log('key',key,'covers',k,JSON.stringify(e));}}
let s=L.slice(k).join('\n');const c=cut(s);console.log('lib copy',c&&c.st.length,c&&md5(c.st),'lines span');
fs.writeFileSync('var/LIB.js',c.st.split(/(?<=;)(?=\s*(?:const |function |return ))/).join('\n'));
