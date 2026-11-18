// ASK 406 build (plan W3 8722, rev 2 8725; B6 answered W4 8729). Record-only. Offline.
// L2 Gloss Plan: the new reader forms (PART B of v57). L2 Count Plan: carries how many new-form glosses were read and left out by the caps.
// Build Save Body: AUDIT v57 PART B states those two counts. Usage: node a406/build.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');const P=require('../a405/p406.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;const log=[];
const node=nm=>d.nodes.find(n=>n.name===nm);
const rep=(nm,a,b)=>{const n=node(nm);const s=n.parameters.jsCode;const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': found '+c+' times: '+a.slice(0,80));n.parameters.jsCode=s.replace(a,()=>b);log.push(nm);};
{const n=node('L2 Gloss Plan');n.parameters.jsCode=P(n.parameters.jsCode);log.push('L2 Gloss Plan');}
rep('L2 Count Plan',"const out={version:'340',ok:false,eng:[],cand:meta.cand||[],","const out={version:'340',ok:false,eng:[],cand:meta.cand||[],f406:{read:meta.n406||0,dropped:meta.d406||0} /* ASK 406: record-only counts */,");
rep('Build Save Body',"PART B (record-only; nothing counted changes): '+G.length+' gloss parts checked; ","PART B (record-only; nothing counted changes): '+G.length+' gloss parts checked'+(E.f406?' (ASK 406 forms: '+(E.f406.read||0)+' glosses read, '+(E.f406.dropped||0)+' left out by the 60-gloss and 30-number caps)':'')+'; ");
for(const nm of new Set(log))acorn.parse(node(nm).parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('nodes changed:',[...new Set(log)].join(', '),'| edits',log.length);
