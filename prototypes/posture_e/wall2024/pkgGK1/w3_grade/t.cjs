const {run,store}=require('./k.cjs');
const ed=(m)=>({'Gate Call openrouter':o=>{const msg=o[0][0].json.choices[0].message;for(const [g,line] of Object.entries(m)){const re=new RegExp('GATE: '+g+' \\|\\|[^\\n]*');if(!re.test(msg.content))throw new Error('no '+g);msg.content=msg.content.replace(re,()=>'GATE: '+g+' || '+line);}}});
const info=g=>{const s=g.gate.seats.find(x=>x.seat==='luna');const nk=g.gate_rows.filter(x=>x.seat==='luna'&&/^NEW /.test(String(x.item))&&/RULE K-/.test(String(x.item))).map(x=>x.item.replace(/^NEW /,'')+' ['+(/RECORD-ONLY/.test(x.cure_reason)?'RECORD-ONLY':/counted there once/.test(x.cure_reason)?'counted by its gate item':'?')+']');
 const r=g.gate_rows.filter(x=>x.seat==='luna'&&/G1[45]\b/.test(String(x.item))).map(x=>String(x.item).slice(0,40)+':'+x.cure_status);return 'uncured '+s.uncured_counted+' cured '+s.cured+' | newK: '+(nk.join('; ')||'none')+' | '+r.join(' ; ');};
const others=g=>JSON.stringify([g.gate.seats.slice(1),g.gate_rows.filter(x=>x.seat!=='luna').map(x=>({...x,at:0})),g.bodies.slice?0:0]);
const A='[L1] Romans 1:3 “made of the seed of David according to the flesh” | [L3] Acts 2:30 “of the fruit of his loins, according to the flesh”';
const P={P0:null,
 a:{G14:'CHANGE TO: D3 vs C3: CHALLENGER LINK BROKEN -- the press on Luke 4:22 is left unanswered -- GROUND: [L1] Luke 4:22 “Is not this Joseph\'s son?” | [L3] John 1:45 “Jesus of Nazareth, the son of Joseph”. || reason'},
 b:{G14:'CHANGE TO: D3 vs C3: DEFENDER LINK BROKEN -- Luke 4:22 is left unanswered. || reason'},
 c:{G14:'KEEP || the line stands'},
 e:{G15:'CHANGE TO: D5 vs C2 (Acts 2:30): CHALLENGER LINK BROKEN -- the proven press of Hebrews 7:14 is left unanswered -- GROUND: '+A+'. || reason'}};
(async()=>{const which=(process.env.W3_W||'GK1');for(const [id,m] of Object.entries(P)){try{const st=store(m?ed(m):null);const a=(await run('LIVE','Gate Record','Gate Call openrouter',st))[0],b=(await run(which,'Gate Record','Gate Call openrouter',st))[0];
 console.log(id,'\n  LIVE:',info(a),'\n  CAND:',info(b),'\n  other seats equal:',others(a)===others(b));}catch(e){console.log(id,'ERR',e.message);}}})();
