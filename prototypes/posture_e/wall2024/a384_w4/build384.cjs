// ASK 384 build (plan rev 4.3, Wall 8405/8409/8415/8419): the live REFP text becomes refp_r43.txt in every inline code node and in the Shared Library's 22 REFP lines.
// The line count is kept (22), so every library map index stays valid; MAP lengths are recomputed. Usage: node build384.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const R=fs.readFileSync(__dirname+'/refp_live.txt','utf8'),N=fs.readFileSync(__dirname+'/refp_r43.txt','utf8');const RL=R.split('\n'),NL=N.split('\n');if(RL.length!==NL.length)throw new Error('line counts differ');
const U=T.unpack(d);const L=U.L,M=U.M;let at=-1,tail='';for(let i=0;i+RL.length<=L.length;i++){const S=L.slice(i,i+RL.length);const last=S[S.length-1];if(S.slice(0,-1).join('\n')===RL.slice(0,-1).join('\n')&&last.startsWith(RL[RL.length-1])){if(at>=0)throw new Error('two library copies');at=i;tail=last.slice(RL[RL.length-1].length);}}
if(at<0)throw new Error('library copy not found');for(let j=0;j<NL.length;j++)L[at+j]=NL[j]+(j===NL.length-1?tail:'');if(tail!==';'&&tail!=='')throw new Error('unexpected tail '+JSON.stringify(tail));
const nodes=[];for(const n of d.nodes){if(n.name==='Shared Library')continue;const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string')continue;const c=j.split(R).length-1;if(!c)continue;if(c!==1)throw new Error(n.name+': found '+c+' times');n.parameters.jsCode=j.replace(R,()=>N);nodes.push(n.name);}
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=U.hdr+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));for(const n of d.nodes){if(nodes.includes(n.name))P(n.parameters.jsCode);}
let left=0;for(const n of d.nodes){const j=n.parameters&&n.parameters.jsCode;if(typeof j==='string'&&j.includes(R))left++;}
fs.writeFileSync(OUT,JSON.stringify(d));console.log('library lines',at,'to',at+NL.length-1,'replaced');console.log('inline nodes',nodes.length,nodes.join('; '));console.log('MAP lengths changed',ch.length,'; live text left',left);
