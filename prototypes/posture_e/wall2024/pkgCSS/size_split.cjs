// item A study (W1, offline): the closing enforcer call split into one call per side, measured on every stored debate against live s103.
// Live: one prompt holds both sides. Split: each call holds the instruction, that side's candidates, and that side's four rounds only.
// Measures characters (tokens estimated at 4 characters per token, an estimate). No prompt text is added; the instruction is sent twice.
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const code=g('/mnt/project-files/wall2024/fetchback_live_s103.json').nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;
const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();const A=[];
(async()=>{for(const r of runs){let F;try{const o=H.out(r,'Final Output');F=o.flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));F=x[x.length-1].main[0][0].json;}catch(e2){continue;}}
 let B;try{B=(await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+code+'\n})();','Quote Report'))[0].json;}catch(e){continue;}
 if(B.cec_skip)continue;const sys=B.body.messages[0].content.length,u=B.body.messages[1].content;const i=u.indexOf('######## THE DEFENDER ########'),j=u.indexOf('######## THE CHALLENGER ########');if(i<0||j<0)continue;
 const head=u.slice(0,i),d=u.slice(i,j),c=u.slice(j);const one=sys+u.length,dp=sys+head.length+d.length,cp=sys+head.length+c.length;
 A.push({r,one,dp,cp,head:sys+head.length});console.log(r+': one call '+one+' | defender call '+dp+' | challenger call '+cp+' | largest '+Math.max(dp,cp)+' ('+(100*(Math.max(dp,cp)-one)/one).toFixed(1)+'%) | total '+(dp+cp)+' (+'+(dp+cp-one)+', +'+(100*(dp+cp-one)/one).toFixed(1)+'%)');}
 const m=f=>Math.round(A.reduce((t,x)=>t+f(x),0)/A.length);
 console.log(A.length+' debates. Mean one call '+m(x=>x.one)+' chars; mean largest split call '+m(x=>Math.max(x.dp,x.cp))+' ('+(100*(m(x=>Math.max(x.dp,x.cp))-m(x=>x.one))/m(x=>x.one)).toFixed(1)+'%); mean total sent '+m(x=>x.dp+x.cp)+' (+'+m(x=>x.dp+x.cp-x.one)+' chars, about '+Math.round(m(x=>x.dp+x.cp-x.one)/4)+' tokens, +'+(100*m(x=>x.dp+x.cp-x.one)/m(x=>x.one)).toFixed(1)+'%: the instruction sent twice).');})();
