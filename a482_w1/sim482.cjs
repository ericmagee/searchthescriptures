// ASK 482 C2b (W2 9617 N1): per ordered pair of the 10 debaters, run the live Init Seats code (engine e0a61271, from the ASK 475 fetchback)
// with every ORDER0 seat accepting the posture, and count the panel seats it can seat. Usage: node sim482.cjs <engine fetchback .json>
const fs=require('fs');const wf=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const code=wf.nodes.find(n=>n.name==='Init Seats').parameters.jsCode;
const ORDER0=(code.match(/const ORDER0=(\[[^\]]*\])/)||[])[1];const order0=eval(ORDER0);
const ENG=['claude','chatgpt','gemini','grok','mimo','haiku','opus','glm','qwen4max','spark'];
const fn=new Function('$input','$execution','$','return (function(){'+code+'\n})();');
const ex={id:1,customData:{set(){}}};const $=()=>{throw new Error('no node');};
const rows=[];let minFree=99,fails=[];
for(const d of ENG)for(const c of ENG){
  const inp={first:()=>({json:{acc:{seats:order0.map(s=>({seat:s,placed:true,status:'ok'}))},src:{body:{topic:'sim',defender:{engine:d,profile:'plain'},challenger:{engine:c,profile:'plain'}}}}})};
  try{const o=fn(inp,ex,$)[0].json;const free=o.panel_order.length+(o.alt_order?o.alt_order.length:0);
    rows.push([d,c,o.panel_order.join('+'),free]);if(free<minFree)minFree=free;}
  catch(e){fails.push(d+' vs '+c+': '+e.message.slice(0,140));rows.push([d,c,'REFUSED',0]);}
}
console.log('version',wf.versionId,'ORDER0',order0.join(','));
console.log('pairs',rows.length,'refused',fails.length,'min seats (panel+alternates)',minFree);
rows.sort((a,b)=>a[3]-b[3]);console.log('lowest 6:');rows.slice(0,6).forEach(r=>console.log(' ',r.join(' | ')));
fails.forEach(f=>console.log('FAIL',f));
fs.writeFileSync('sim482_out.tsv','defender\tchallenger\tpanel\tseats_panel_plus_alternates\n'+rows.map(r=>r.join('\t')).join('\n')+'\n');
