const fs=require('fs');const rows=JSON.parse(fs.readFileSync('live.json'));
const strip=t=>{const s=String(t||'');const i=s.indexOf('\n\n');return /^(CHALLENGER|DEFENDER) \(/.test(s)&&i>0?s.slice(i+2):s;};
const run=(file,r)=>{const src=fs.readFileSync(file,'utf8');
 const nodes={'Init Seats':{run_token:'T',dpos:'the affirmative'},'Resolve Seats':{defender:{fam:'mimo',model:'mimo-v2.6-pro',tok:100}},'Init with Guards':{dsys:'DSYS',topic:r.topic},
  'C1 Extract':{raw:strip(r.gr1)},'C2 Extract':{raw:strip(r.gr2)}};
 const $=n=>({first:()=>({json:nodes[n]||{}})});return new Function('$',src)($)[0].json.call.body.messages[1].content;};
const L=rows.find(r=>r.tok.includes('27177')),O=rows.find(r=>r.tok.includes('27088'));
const mL=run('D3_Build.new.js',L),mO=run('../f1b/D3_Build.new.js',O),mOn=run('D3_Build.new.js',O);
console.log('27177 on ec464cdc: message chars',mL.length);
console.log('27088 on 8059223d code: message chars',mO.length);
console.log('27088 rounds on ec464cdc code:',mOn.length);
const i=mL.indexOf('EVERY VERSE');const j=mL.indexOf('\n\nLINK ROUND -- exhibit');const list=mL.slice(i,j);
console.log('list chars',list.length);fs.writeFileSync('live_list.txt',list);console.log(list);
// header strip sanity
console.log('raw gr2 head:',strip(L.gr2).slice(0,80).replace(/\n/g,'|'));
