// ASK 646 build (W4): Init Seats outputs every order seat that was not seated, with the reason it was dropped; the JUDGE ORDER line ends "; LEFT OUT: ...". node b646.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const once=(nm,a,b)=>{const n=E.nodes.find(k=>k.name===nm);const c=n.parameters.jsCode;if(c.split(a).length!==2)throw new Error('ASK 646 build: anchor not found once in '+nm+': '+a.slice(0,60));n.parameters.jsCode=c.replace(a,()=>b);};
const A1="const ALT_DROPPED=__ALT.filter(s=>s in __DROP).map(s=>({seat:s,family:FAM_PANEL[s]||null,reason:__DROP[s]}));";
once('Init Seats',A1,A1+" const SEAT_LEFT_OUT=[...new Set(ORDER0)].filter(s=>panel_order.indexOf(s)<0&&s!==panel_reserve&&ALT_ORDER.indexOf(s)<0).map(s=>({seat:s,reason:__DROP[s]})); /* ASK 646: each order seat not seated (a seat in both lists once), with the reason its filter recorded in __DROP: the agreement filter, the debater filter, the panel filter, or the alternate filter */");
once('Init Seats',"alt_dropped:ALT_DROPPED,","alt_dropped:ALT_DROPPED,seat_left_out:SEAT_LEFT_OUT /* ASK 646 */,");
once('Build Save Body',"'; alternates '+L(I.alt_order)+']';","'; alternates '+L(I.alt_order)+'; LEFT OUT: '+((I.seat_left_out||[]).length?I.seat_left_out.map(x=>(x.seat+' ('+x.reason+')').replace(/[\\[\\]]/g,'')).join(', '):'none')+']'; /* ASK 646: who was left out and why */");
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 646 built:',OUT,'| nodes changed: Init Seats, Build Save Body');
