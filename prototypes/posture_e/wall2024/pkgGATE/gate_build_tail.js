// E-GATE, Gate Build (W2; WALL-2024 2242 design, rulings 2243 and 2251). Runs after Send Back Record. For each panel seat that answered a
// send-back, its answers are applied (E-APPLY, as Alternate Merge will apply them) and the corrected judgment is read again (gate_lib above).
// A seat with gate items is asked once more, in its own conversation after the send-back exchange. Passes nothing on: Gate Record reads
// Send Back Record's output by name.
const PASS=$input.first().json; // Send Back Record's output
const skip=(why,rep)=>[{json:{gate_skip:true,gate_why:why,gate_report:rep||[]}}];
if(!Array.isArray(PASS.sb_items)||!PASS.sb_items.length)return skip('no send-back answer was recorded');
const PB0=(()=>{try{return $('Panel Build').first().json;}catch(e){return null;}})();
const BODIES=Array.isArray(PASS.bodies)?PASS.bodies:(()=>{try{return $('Panel Cure Check').first().json.bodies||[];}catch(e){return [];}})();
let SBB=[],SBC=[];try{SBB=$('Send Back Build').all().map(x=>x.json);}catch(e){SBB=[];}try{if($('Send Back Call openrouter').isExecuted)SBC=$('Send Back Call openrouter').all().map(x=>x.json);}catch(e){SBC=[];}
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const out=[];const report=[];
BODIES.forEach((s,i)=>{let b;try{b=JSON.parse(s);}catch(e){return;}const p=b.payload||{};const seat=p.judge_seat;const its=PASS.sb_items.filter(x=>x.seat===seat);if(!its.length)return;
 const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
 const j=PB0&&(PB0.judges||[]).find(q=>q.seat===seat);const PT=j?gatePromptText2024(j.body):'';const ctx={R:PT?ciRounds(PT):null,DL:PT?drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
 let G;try{G=gateItems2024(seat,p.verdict_raw,F,its,ctx);}catch(e){report.push({seat,error:String(e&&e.message||e).slice(0,300)});return;}
 const rp={seat,items:G.items.map(x=>({gid:x.gid,kind:x.kind,src:x.src,live:x.live,why:x.why})),newk_error:G.newk_error,rounds_read:!!ctx.R};report.push(rp);
 if(!G.items.length)return;
 const k=SBB.findIndex(x=>x&&x.seat===seat);const sb=k>=0?SBB[k]:null;const rj=k>=0?SBC[k]:null;
 const sbTxt=rj&&rj.choices&&rj.choices[0]&&rj.choices[0].message&&typeof rj.choices[0].message.content==='string'?rj.choices[0].message.content:null;
 if(!sb||!sb.body||!Array.isArray(sb.body.messages)||sbTxt==null){rp.not_sent='the send-back conversation could not be read; the items are recorded only';return;}
 const msg='The engine applied your send-back answers to your judgment and read the corrected judgment again. It cannot accept the items below as they stand. You keep the decision, under the same rules. For each item, CHANGE one of its lines or KEEP, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n'
  +'A KEEP answers only a NOT APPLIED item: that change then stays unapplied. Every other item is answered only by a CHANGE TO one of its lines, written in full in your judgment\'s own line form; the engine applies it with your send-back answers and reads the judgment again. An item that is not answered, is kept, or is still raised after your change counts as a debate rule violation not cured.\n\n'
  +G.items.map(x=>'ITEM '+x.gid+' ('+x.kind+'; '+x.src+'):\nTHE ENGINE: '+cut(x.why,900)+(x.lines&&x.lines.length?x.lines.map(l=>'\nLINE: '+cut(l,1500)).join(''):'')+(x.to?'\nYOUR SEND-BACK ANSWER: CHANGE TO: '+cut(x.to,1500):'')).join('\n\n')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nGATE: <item id> || KEEP || <one sentence quoting the words that decide it>\nGATE: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';
 const body={...sb.body,messages:[...sb.body.messages,{role:'assistant',content:sbTxt},{role:'user',content:msg+__agrTail(sb.body.messages)}]};
 out.push({json:{gate_skip:false,seat,idx:i,api_model:sb.api_model||null,run_token:sb.run_token||null,F,items:G.items,msg,body}});});
if(!out.length)return skip('no seat has a gate item',report);
out[0].json.gate_report=report;return out;
