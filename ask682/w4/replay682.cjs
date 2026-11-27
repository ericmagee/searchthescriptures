// ASK 682 replay: the live D4 Build (66ba992d) classifier, PRS.parse + classify0 + FLOOR, on 43103 challenger round 2 presses.
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
const a=src.indexOf('const PRS=(()=>{');const b=src.indexOf('const RND=F=>',a);
const body=src.slice(a+'const PRS=(()=>{'.length,b);
const REFP={keys:(t)=>{const out=[];for(const m of String(t).matchAll(/((?:[1-3] )?[A-Z][a-z]+) (\d+):(\d+)/g))out.push({key:m[1]+' '+m[2]+':'+m[3],pos:m.index});return out;}};
const f=new Function('REFP','lbFoot',body+'\nreturn {parse,classify,classify0,FLOOR,entries};');
const P=f(REFP,()=>[]);
const presses=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
for(const t of presses){const e=P.parse(t);const c0=P.classify0(e,{},'DR2',null);let fl=null;try{fl=P.FLOOR(e);}catch(x){fl={err:String(x)};}
 const c=P.classify(e,{},'DR2',null);
 console.log(e.ref,'| means:',JSON.stringify(e.means),'| classify0:',c0.cls,'| floor:',JSON.stringify(fl),'| FINAL:',c.cls,'|',c.why);}
