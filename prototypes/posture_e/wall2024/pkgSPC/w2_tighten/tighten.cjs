// W2 ASK 279 tightening proposal (Wall grade). usage: run in a folder holding target.json (W4 build of f37fc5d4) -> writes target4.json. Then: node ../t2.cjs ./target4.json <tags60.json> <ow60.json>
const fs=require('fs');const W=require('./target.json');const P=W.nodes.find(x=>x.name==='L2 Count Plan');let p=P.parameters.jsCode;const p0=p.length;
const A="const CR=L2C.refsIn(tail).filter(k=>";const S0="(?<=[.!?;])[\"”'’)\\]]*\\s+(?=[\"“'‘(*_\\[]*[A-Z0-9])/)";const A3="for(const k of CR){if(hit.includes(k))continue;";
for(const a of [A,S0,A3])if(p.split(a).length!==2)throw 'anchor '+a;
const CUE=String.raw`const __cue=(tl,k)=>{const mm=k.match(/^(.+) (\d+):(\d+)$/);if(!mm)return false;const re=new RegExp(mm[1].replace(/\s+/g,'\\s+')+'\\.?\\s+'+mm[2]+':'+mm[3]+'(?!\\d)','g');for(const z of tl.matchAll(re)){const pre=tl.slice(Math.max(0,z.index-60),z.index);const post=tl.slice(z.index+z[0].length,z.index+z[0].length+3);if(/^\s*[-–]\s*\d/.test(post))continue;if(/\b(?:after|before|through|than|not|question\s+of|gives?|defines?|joins?|sign\s+of)\b[^.;]*$/i.test(pre))continue;if(/\b(?:in|at|stands\s+in|word\s+(?:of|in|at)|verb\s+(?:of|in|at)|same\s+\w+\s+as|shared\s+with|as\s+in)\s*$/i.test(pre)||/\b(?:in|at)\s+[^.;()]*\d:\d+\s*(?:,|\band)\s*$/i.test(pre)&&!/,\s*and\s*$/.test(pre))return true;}return false;};`;
p=p.replace(A,()=>CUE+"const CR=L2C.refsIn(tail).filter(k=>__cue(tail,k)&&")
 .replace(S0,()=>"(?<=[^.][.!?;]|[!?;])[\"”'’)\\]]*\\s+(?=[\"“'‘(*_\\[]*[A-Za-z0-9\\u00C0-\\u024F])/)")
 .replace(A3,()=>A3+"if(NM.some((o,jj)=>jj!==j&&(IX.V[k]||[]).some(r=>L2C.numOf(r.strongs_number)===o[1]+o[2])))continue;");
P.parameters.jsCode=p;new Function(p);fs.writeFileSync('target4.json',JSON.stringify(W));console.log(p0,'->',p.length);
