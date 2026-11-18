// ASK 399 item 4a (W1 8491; W2 8492 item 3; W3 8494): every read of the collision list in v25 (cureRecompute) and v37 (sbApply2024), by library line, as each stub assembles it.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
let d=JSON.parse(fs.readFileSync(process.argv[2]||__dirname+'/t386.json'));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);
function lines(stub){const parts=[];for(const e of U.M[stub].p){if(typeof e==='number')parts.push([e,U.L[e]]);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)parts.push([i,U.L[i]]);else parts.push(['lit',e[0]]);}return parts;}
function fnLines(stub,name){const parts=lines(stub);let o=0;const st=[];for(const [i,l] of parts){st.push([o,i,l]);o+=l.length+1;}const S=parts.map(x=>x[1]).join('\n');
 const k=S.indexOf('function '+name+'(');const ast=acorn.parse('(async()=>{\n'+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});let fn=null;
 (function w(n){if(!n||fn)return;if(n.type==='FunctionDeclaration'&&n.id&&n.id.name===name){fn=n;return;}for(const x of Object.keys(n)){const v=n[x];if(Array.isArray(v))v.forEach(w);else if(v&&typeof v.type==='string')w(v);}})(ast);
 const off='(async()=>{\n'.length;const a=fn.start-off,b=fn.end-off;return st.filter(([s,i,l])=>s+l.length>=a&&s<=b);}
const out={};
for(const [stub,fn] of [['Panel Cure Check','cureRecompute'],['Gate Record','sbApply2024']]){const F=fnLines(stub,fn);out[fn+' (stub '+stub+')']={assembly:F.map(x=>x[1]),reads:F.filter(([s,i,l])=>/\bcol\b|P\.col\b|\.col\b/.test(l)).map(([s,i,l])=>{const hits=[...l.matchAll(/[^;{}]*\b(?:col|P\.col)\b[^;{}]*/g)].map(m=>m[0].trim().slice(0,170));return {line:i,hits};})};}
fs.writeFileSync(__dirname+'/colreads399_out.json',JSON.stringify(out,null,1));
for(const k of Object.keys(out)){console.log('== '+k+' assembly: '+JSON.stringify(out[k].assembly.reduce((a,x)=>{const l=a[a.length-1];if(typeof x==='number'&&l&&typeof l[1]==='number'&&l[1]===x-1)l[1]=x;else a.push([x,x]);return a;},[]).map(r=>r[0]===r[1]?r[0]:r[0]+'-'+r[1])));for(const r of out[k].reads){console.log(' L'+r.line);for(const h of r.hits)console.log('    '+h);}}
