// ASK 306 test: kvSegments and pwSegments (the two PW_SEG readers), old vs new, on every stored judgment (a297 data: 582 rows), both sides. Prints every change.
const fs=require('fs');const st=require(__dirname+'/stub.cjs');
const load=(f,node,names)=>{const d=st(f,node);const skip=new Set();d.own.forEach(([a,n])=>{for(let i=a;i<a+n;i++)skip.add(i);});const S=d.S.map((l,i)=>skip.has(i)?'':l);const keep=[];
 for(let i=0;i<S.length;i++){const l=S[i];if(!/^(?:function |const |let )/.test(l))continue;for(let k=i;k<Math.min(S.length,i+150);k++){const s=S.slice(i,k+1).join('\n');try{new Function(s);keep.push(/^function /.test(l)?s:'try{eval('+JSON.stringify(s.replace(/^(?:const|let) /,'var '))+')}catch(e){}');i=k;break;}catch(e){}}}
 return new Function('$','$input',keep.join('\n')+'\nreturn {'+names.join(',')+'};')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}),null);};
const O=load(process.argv[2],'Panel Payloads',['kvSegments','pwSegments']),N=load(process.argv[3],'Panel Payloads',['kvSegments','pwSegments']);
let rows=[];for(const f of ['j0','j300','j600'])rows=rows.concat(require('../a297/data/'+f+'.json'));
const txt=v=>{let T=String(v||'');const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){}}return T.replace(/\n\n\[AUDIT v[\s\S]*$/,'');};
let n=0,ch={kv:0,pw:0},err=0;const sum=a=>JSON.stringify((a||[]).map(x=>x.ns));
for(const r of rows){const T=txt(r.verdict_raw);for(const side of ['DEFENDER','CHALLENGER'])for(const k of ['kv','pw']){n++;let a,b;try{a=k==='kv'?O.kvSegments(T,side):O.pwSegments(T,side);b=k==='kv'?N.kvSegments(T,side):N.pwSegments(T,side);}catch(e){err++;continue;}
 if(JSON.stringify(a)!==JSON.stringify(b)){ch[k]++;console.log(k,side.padEnd(10),String(r.id).slice(0,8),r.judge_seat,'old',sum(a),'new',sum(b));for(const x of b)if(!a.some(y=>JSON.stringify(y)===JSON.stringify(x)))console.log('     +',JSON.stringify(x.seg||x).slice(0,200));}}}
console.log('reads',n,'changed',JSON.stringify(ch),'errors',err,'rows',rows.length);
