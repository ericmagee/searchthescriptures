const fs=require('fs');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [F,NAME,W1,W2]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(F));w=w.data||w;
const src=where=>{if(where.startsWith('lib:')){const U=T.unpack(w);return T.rb(U.L,U.M[where.slice(4)]);}return w.nodes.find(n=>n.name===where).parameters.jsCode;};
const get=s=>{const cm=[];const ast=acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,onComment:(b,t,a,e)=>cm.push([a,e])});let r=null;
 const walk=n=>{if(r||!n||typeof n.type!=='string')return;if((n.type==='FunctionDeclaration'&&n.id&&n.id.name===NAME)||(n.type==='VariableDeclarator'&&n.id&&n.id.name===NAME&&n.init)){let t='',k=n.start;for(const [a,b] of cm.filter(([a,b])=>a>=n.start&&b<=n.end)){t+=s.slice(k,a);k=b;}r=t+s.slice(k,n.end);return;}for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};walk(ast);return r;};
const a=get(src(W1)),b=get(src(W2));let i=0;while(i<a.length&&a[i]===b[i])i++;let j=0;while(j<a.length-i&&j<b.length-i&&a[a.length-1-j]===b[b.length-1-j])j++;
console.log('len',a.length,b.length,'| first diff at',i);console.log('A>',a.slice(Math.max(0,i-80),a.length-j+40).slice(0,700));console.log('B>',b.slice(Math.max(0,i-80),b.length-j+40).slice(0,700));
