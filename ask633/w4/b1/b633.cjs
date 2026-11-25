// ASK 633 build (W4): Build Save Body names every cause of a round re-call. Usage: node b633.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const OLD="FF.push('[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT: '+b.seat+' ('+b.side+'); ROUND: ['+b.round+']; SENT BACK: '+((b.first&&b.first.hits)||[]).length+' sentence(s); KEPT: '";
const NEW="const __pv633=b.round==='CR4'?(()=>{try{return $('D4B Build').isExecuted?($('D4B Build').first().json.press_open||[]).length:0;}catch(e){return 0;}})():null; /* ASK 633: D4B alone checks pressed verses (ASK 628); D4B Extract does not carry press_open */FF.push('[AUDIT v47: ROUND RE-CALL (pkgBAR, pkgLAYB) -- SEAT: '+b.seat+' ('+b.side+'); ROUND: ['+b.round+']; SENT BACK: '+((b.first&&b.first.hits)||[]).length+' barred sentence(s); '+((b.layers&&b.layers.first&&b.layers.first.items)||[]).length+' layer point(s)'+(__pv633===null?'':'; '+__pv633+' pressed verse(s) with no ANSWER line')+'; KEPT: '"; /* ASK 633 */
const n=E.nodes.find(x=>x.name==='Build Save Body');const c=n.parameters.jsCode;
if(c.split(OLD).length!==2)throw new Error('ASK 633 build: the statement is not found exactly once');
n.parameters.jsCode=c.replace(OLD,()=>NEW);
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 633 built:',OUT);
