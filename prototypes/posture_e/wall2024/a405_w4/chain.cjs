// Replay the L2 chain (Citation Scan .. L2 Count Plan) of a workflow file on a stored debate's rounds, with real REST reads (publishable key, cached).
const fs=require('fs'),cp=require('child_process');
const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';const CF=__dirname+'/cache.json';const CA=fs.existsSync(CF)?JSON.parse(fs.readFileSync(CF)):{};let net=0;
function get(url,prefer){const key=url+'|'+(prefer||'');if(!CA[key]){net++;const out=cp.execFileSync('curl',['-sS','-D','-','--max-time','90',url,'-H','apikey: '+K,'-H','Authorization: Bearer '+K,'-H','Prefer: '+(prefer||'')],{maxBuffer:1<<28}).toString();
 const sp=out.split(/\r?\n\r?\n/);let hd='',body='';for(let i=0;i<sp.length;i++){if(/^HTTP\//.test(sp[i])&&!/Connection Established/.test(sp[i])){hd=sp[i];body=sp.slice(i+1).join('\n\n');break;}}
 const st=+((hd.match(/^HTTP\/\S+\s+(\d+)/)||[])[1]);const h={};for(const l of hd.split(/\r?\n/).slice(1)){const m=l.match(/^([^:]+):\s*(.*)$/);if(m)h[m[1].toLowerCase()]=m[2];}
 let b;try{b=JSON.parse(body);}catch(e){b=body;}CA[key]={body:b,headers:{'content-range':h['content-range']},statusCode:st};}
 return JSON.parse(JSON.stringify(CA[key]));}
const ORDER=['Citation Scan','Cited Verses','Quote Compare','Find Words','L2 Words Plan','L2 Words','L2 Lexicon Plan','L2 Lexicon','L2 Gloss Plan','L2 Gloss Any','L2 Gloss Read','L2 Gloss Pages Plan','L2 Gloss Pages Any','L2 Gloss Pages Read','L2 Count Plan'];
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3||null,dr3:r.challenger_r3||null,cr4:r.defender_r4||null,dr4:r.challenger_r4||null,synthesis:r.synthesis||''});
const cl=x=>JSON.parse(JSON.stringify(x));
function replay(wf,r,over){const ns=(wf.data||wf).nodes;const node=n=>ns.find(x=>x.name===n);const M={'Final Output':[{json:F_(r)}]};
 const $=n=>{const it=M[n];return it?{isExecuted:true,all:()=>cl(it),first:()=>cl(it[0])}:{isExecuted:false,all:()=>{throw new Error('Node not executed: '+n)},first:()=>{throw new Error('Node not executed: '+n)}};};
 let prev=M['Final Output'];
 for(const n of ORDER){const x=node(n);let out;
  if(n==='L2 Gloss Read'&&M.__skipRead){continue;} if(n==='L2 Gloss Pages Read'&&M.__skipPages){continue;}
  if(x.type==='n8n-nodes-base.code'){const src=(over&&over[n])||x.parameters.jsCode;out=new Function('$','$input','$execution','$workflow','require',src)($,{all:()=>cl(prev),first:()=>cl(prev[0])},{id:'replay',customData:{set(){},get(){}}},{id:'moMxiV4Irg1uRBZN'},require);}
  else if(x.type==='n8n-nodes-base.if'){const t=prev.filter(i=>i.json.none!==true);if(n==='L2 Gloss Any'&&!t.length)M.__skipRead=true;if(n==='L2 Gloss Pages Any'&&!t.length)M.__skipPages=true;out=t;}
  else{const full=!!(x.parameters.options&&x.parameters.options.response);const u=x.parameters.url;out=[];
   const items=/\$json\.url/.test(u)?prev:[prev[0]];
   for(const it of items){const url=/\$json\.url/.test(u)?it.json.url:$(u.match(/\$\('([^']+)'\)/)[1]).first().json[u.match(/json\.([a-z_]+)/)[1]];
    const R=get(url,(it.json&&it.json.prefer)||'');
    if(full)out.push({json:{statusCode:R.statusCode,headers:R.headers,body:R.body}});
    else if(R.statusCode>=400)out.push({json:{error:{message:String(JSON.stringify(R.body)).slice(0,200)}}});
    else if(Array.isArray(R.body))for(const b of R.body)out.push({json:b});else out.push({json:R.body});}
   if(!out.length&&x.alwaysOutputData)out=[{json:{}}];}
  M[n]=out;prev=out;}
 return M;}
module.exports={replay,save:()=>fs.writeFileSync(CF,JSON.stringify(CA)),net:()=>net};
