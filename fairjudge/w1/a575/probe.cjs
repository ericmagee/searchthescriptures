// ASK 575 probe: the POSTURE statement in each node of the live engine (d8292f62 base), its texts, lines found in LIB, free names.
const acorn=require('/home/claude/searchthescriptures/node_modules/acorn');const fs=require('fs'),cr=require('crypto');
const E=JSON.parse(fs.readFileSync('../a573/base_engine_d8292f62.json')),C=JSON.parse(fs.readFileSync('../a573/base_child_de9efc4e.json'));
const lib=w=>{const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))}};
const {L,M}=lib(E);const idx=new Map();L.forEach((x,i)=>{if(!idx.has(x))idx.set(x,[]);idx.get(x).push(i)});
const out={};
for(const [w,tag] of [[E,'E'],[C,'C']])for(const n of w.nodes){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library'||!/\bPOSTURE\b/.test(s))continue;
 const pre='(async function(){\n';const ast=acorn.parse(pre+s+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});let hit=null,where='';
 const walk=(a,p)=>{for(const st of a){if(st.type==='TryStatement'){walk(st.block.body,p+'try>');continue}if(st.type==='VariableDeclaration'&&st.declarations.some(d=>d.id.name==='POSTURE')){hit=st;where=p||'top'}}};walk(ast.body[0].expression.body.body,'');
 const uses=(s.match(/\bPOSTURE\b/g)||[]).length;if(!hit){console.log(tag,n.name,'POSTURE used',uses,'no top-level declaration');continue}
 const t=(pre+s).slice(hit.start,hit.end);out[tag+':'+n.name]=t;const ls=t.split('\n');const inl=ls.map(x=>idx.has(x)?idx.get(x):null);
 console.log(tag,n.name.padEnd(24),'len',t.length,'md5',cr.createHash('md5').update(t).digest('hex').slice(0,8),'where',where,'lines',ls.length,'in LIB',inl.filter(Boolean).length,'chars not in LIB',ls.filter((x,i)=>!inl[i]).reduce((a,x)=>a+x.length+1,0),'uses',uses);}
fs.writeFileSync('posture_texts.json',JSON.stringify(out,null,1));
