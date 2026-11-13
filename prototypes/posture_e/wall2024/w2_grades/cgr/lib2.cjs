const fs=require('fs');
module.exports=(file)=>{const r=JSON.parse(fs.readFileSync(file));const W=(r.data||r).workflow||(r.data||r);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
const blocks=[];let cur=null;let iife=false;for(const l of Lb){if(iife){cur.push(l);if(/\}\)\(\);\s*$/.test(l)){blocks.push(cur);cur=null;iife=false;}continue;}if(/^const\s+[\w$]+\s*=\s*\(function\(\)\{/.test(l)&&!/\}\)\(\);\s*$/.test(l)){if(cur)blocks.push(cur);cur=[l];iife=true;continue;}if(/^(function\s+[\w$]+\s*\(|const\s+[\w$]+\s*=)/.test(l)){if(cur)blocks.push(cur);cur=[l];}else if(cur&&/^\s/.test(l)&&!/^\s*$/.test(l))cur.push(l);else{if(cur)blocks.push(cur);cur=null;}}if(cur)blocks.push(cur);
const ok=[];for(const bl of blocks){const s=bl.join('\n');try{new Function(s);ok.push(s);}catch(e){}}
const names=[...new Set(ok.map(s=>s.match(/^(?:function\s+|const\s+)([\w$]+)/)[1]))];
// wrap each const in try so a failing initializer does not stop the rest
const body=ok.map(s=>/^const /.test(s)?s.replace(/^const\s+([\w$]+)\s*=/,'var $1;try{$1=')+'}catch(e){}':s).join('\n');
const env=new Function('$','$input',body+'\nreturn {'+names.join(',')+'};');
return {fns:env(()=>({isExecuted:false,first(){throw 0;},all(){return [];}}),{all:()=>[]}),Lb};};
