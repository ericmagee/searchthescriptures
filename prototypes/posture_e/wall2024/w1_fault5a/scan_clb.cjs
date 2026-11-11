// W1 study of W3's known fault 5a (operator ruling 459: a collision the defender answers with a fit, not answered back, does not count toward a defender win).
// Scan every stored first judge reply: RESULT, verdict, standings and every CHALLENGER LINK BROKEN / STANDS line with the line under it.
const fs=require('fs');const W='/mnt/project-files/wall2024/';const out=[];
const texts=[];const content=j=>{const x=j.response!==undefined?j.response:j;if(typeof x==='string')return x;if(x&&x.choices&&x.choices[0])return x.choices[0].message&&x.choices[0].message.content;return null;};
const flat=d=>{if(!Array.isArray(d))d=[d];const o=[];for(const e of d){if(e&&e.data&&e.data.main)for(const b of e.data.main)for(const it of (b||[]))o.push(it);else if(e&&e.json)o.push(e);}return o;};
const pushResp=(run,arr)=>{for(const it of arr||[]){const j=it.json||it;let t=content(j);if(t==null)continue;if(typeof t!=='string')t=JSON.stringify(t);t=t.replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\"/g,'"');texts.push({run,slot:j.ppj_slot,t});}};
for(const f of fs.readdirSync(W+'inputs').filter(f=>/_Panel_Judge_\d_openrouter\.json$/.test(f))){const d=JSON.parse(fs.readFileSync(W+'inputs/'+f));pushResp(f.split('_')[0]+'/J'+f.match(/Judge_(\d)/)[1],flat(d));}
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f))){const ex=JSON.parse(fs.readFileSync(W+f));const r=(ex.data||ex).resultData.runData;const x=r['Panel Judges Collect'];if(!x)continue;pushResp(f.slice(2,7),x.slice(-1)[0].data.main[0]);}
let nC=0,nDW=0;for(const {run,slot,t} of texts){const res=(t.match(/RESULT:\s*([A-Z ]+?)\s*(?:--|\n|$)/)||[])[1]||'?';const cs=(t.match(/CHALLENGE STANDING:\s*([A-Z-]+)/)||[])[1]||'?';const vt=(t.match(/"verdict_tag"\s*:\s*"([A-Z-]+)"/)||[])[1]||'?';
 const lines=t.split('\n');const clb=[];lines.forEach((l,i)=>{if(/^\s*\**D\d+\s+vs\.?\s+C\d+[^\n]*CHALLENGER LINK BROKEN/.test(l))clb.push({line:l.slice(0,400),next:(lines[i+1]||'').slice(0,400)});});
 nC+=clb.length;if(/DEFENDER WINS/.test(res))nDW++;out.push({run,slot,len:t.length,result:res,verdict:vt,challenge_standing:cs,clb});}
fs.writeFileSync(__dirname+'/scan_clb.json',JSON.stringify(out,null,1));
console.log('judge replies',texts.length,'| DEFENDER WINS',nDW,'| CHALLENGER LINK BROKEN lines',nC);
for(const o of out)if(/DEFENDER/.test(o.result)||o.clb.length)console.log(o.run,'slot',o.slot,'|',o.result,'|',o.verdict,'| challenge',o.challenge_standing,'| CLB lines',o.clb.length);
