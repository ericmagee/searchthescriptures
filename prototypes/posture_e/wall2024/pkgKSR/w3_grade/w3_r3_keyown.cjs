// W3 rev 3, V4: a judge's OWN KEYSTONE line that carries the engine words, placed where Send Back Build reads it (after the recompute), under the rev 3 candidate.
// In my first run these three plants matched nothing under ALL (the judge's STANDS line is already rewritten by K1), so they are redone here on the line ALL holds. Single substitution.
const {run,rd,U,cl}=require('./w3_KSR_ECB.cjs');const SBN=['Panel Cure Check','Enforcer Record','Judge Enforcer Record'];
const ORIG='KEYSTONE: D6 -- STANDS -- The conclusion that Christ had no biological father remains an exhibited inference from the conception accounts and the birth of Mary; it was neither withdrawn nor textually refuted under the prescribed collision test.';
const ENG='KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION';
const forms={'R4b own STANDS line carrying the eight words':'KEYSTONE: D6 -- STANDS -- not BROKEN BY A CONFIRMED CLOSING CONTRADICTION; the conclusion remains',
 'R5c own line in the engine form for link 4 (not confirmed)':'KEYSTONE: D4 -- BROKEN -- LINK 4 BROKEN BY A CONFIRMED CLOSING CONTRADICTION',
 'R5d the engine line for link 6 with more words':'KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION, yet the defense stands',
 'control: the engine line itself, untouched':null};
(async()=>{for(const tag of ['LIVE',process.argv[2]||'ALL']){for(const [name,form] of Object.entries(forms)){let hits=0;
  const hook={before:{'Send Back Build':async(over,out)=>{if(!form)return;for(const n of SBN){const cur=cl(out(n));let h=0;
     const walk=v=>{if(Array.isArray(v))v.forEach((x,i)=>{if(typeof x==='string'){const y=rep(x);if(y!==x){v[i]=y;h++;}}else walk(x);});else if(v&&typeof v==='object')for(const k of Object.keys(v)){if(typeof v[k]==='string'){const y=rep(v[k]);if(y!==v[k]){v[k]=y;h++;}}else walk(v[k]);}};
     // only sol's material: replace the judge's original line and (under the candidate) the engine line that replaced it, once each, in strings that name sol's original line or are sol's body
     const rep=s=>{let t=s;if(t.includes(ORIG))t=t.split(ORIG).join(form);return t;};walk(cur);
     // sol's body in Panel Cure Check: under the candidate the live KEYSTONE line is the engine line
     if(n==='Panel Cure Check'){const b=cur[0][0].json.bodies[2];const sw=v=>{if(Array.isArray(v))v.forEach((x,i)=>{if(typeof x==='string'&&x.includes(ENG)&&!x.includes(form)){v[i]=x.split('\n').map(l=>l.trim()===ENG?form:l).join('\n').split('\\n').map(l=>l===ENG?form:l).join('\\n');h++;}else sw(x);});else if(v&&typeof v==='object')for(const k of Object.keys(v)){const x=v[k];if(typeof x==='string'&&x.includes(ENG)&&!x.includes(form)){v[k]=x.split('\n').map(l=>l.trim()===ENG?form:l).join('\n').split('\\n').map(l=>l===ENG?form:l).join('\\n');h++;}else sw(x);}};sw(b);}
     if(h){over[n]=cur;hits+=h;}}}}};
  const r=await run(tag,hook);const sb=r.over['Send Back Build'][0].find(x=>x.json.seat==='sol').json;const its=(sb.items||[]).filter(i=>/KEY/.test(i.rule+i.item));const ns=(r.over['Send Back Build'][0][0].json.sb_not_sent||[]).filter(n=>n.seat==='sol'&&/KEY/.test(n.rule+n.item));
  const body=U(JSON.stringify(r.over['Panel Cure Check'][0][0].json.bodies[2]));const cur=(body.match(/(?:^|\n|")(KEYSTONE: D\d[^\n"\\]{0,100})/)||[])[1];
  console.log(tag+' | '+name+' | strings planted '+hits+' | sol first KEYSTONE line in body: "'+String(cur).slice(0,95)+'" | KEYSTONE items SENT: '+(its.map(i=>i.sid+' '+i.rule+' :: '+String(i.line).slice(0,70)).join('; ')||'none')+' | WITHHELD: '+(ns.map(n=>n.rule+' '+String(n.why||'').slice(0,60)).join('; ')||'none'));}}})().catch(e=>console.log('ERROR '+e.stack));
