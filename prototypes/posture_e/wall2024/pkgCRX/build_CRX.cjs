// pkgCRX (ASK 123, option 1): one shared contradiction rule text for Close Enforcer Build and Judge Contradiction Build,
// and the pkgCRB CLOSING BLOCK under each judge-named candidate. The Close Enforcer Build text is the source and stays byte-equal.
// usage: node build_CRX.cjs <in.json> <out.json>
const fs=require('fs');const {RULES,FORMAT,lit,cecBlockOf}=require('./crx_lib.cjs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const CN=w.nodes.find(n=>n.name==='Close Enforcer Build'),JN=w.nodes.find(n=>n.name==='Judge Contradiction Build');const C=CN.parameters.jsCode,J=JN.parameters.jsCode;
const CP=lit(C,'PROMPT');const R=RULES(CP),FM=FORMAT(CP);const BLK=cecBlockOf(C);
const JHEAD="You are the closing enforcer. A debater's closing round may not contradict what the same debater stated in its earlier rounds.\nRead each side's closing round against that side's own earlier rounds. The closing rounds were already read once before the judges sat. Answer every candidate listed below; each was named by a judge after it read the debate. Give each candidate its link.\n";
const JQUOTE="For each contradiction, quote both sentences word for word, each from the round it stands in, and name the link it belongs to: the link whose block in the closing round holds the closing sentence, or, where the block names no link, the link the earlier sentence supports. The defender's links are the numbers of its DECLARED CHAIN in [CR1]; the challenger's links are the numbers of its LINK blocks in [DR3].\n";
const JP=JHEAD+R+JQUOTE+FM;
const a=J.indexOf('const PROMPT0=');const rep=J.indexOf("const PROMPT=PROMPT0.replace(",a);const repEnd=J.indexOf(');\n',rep)+3;if(a<0||rep<0)throw new Error('anchor');
let J2=J.slice(0,a)+BLK+'\nconst PROMPT='+JSON.stringify(JP)+'; /* pkgCRX: shared RULES and FORMAT from Close Enforcer Build (pkgCRX/crx_lib.cjs) */\n'+J.slice(repEnd);
const OLD="const cl=cands.length?cands.map(c=>c.id+' -- '+c.side+' -- '+c.kind+' '+c.n+' -- EARLIER ['+c.earlier_round+'] \"'+c.earlier_q+'\" -- CLOSING ['+c.closing_round+'] \"'+c.closing_q+'\" -- named by '+c.by+(c.why?': '+c.why:'')).join('\\n'):'none';";
if(J2.split(OLD).length!==2)throw new Error('cl anchor');
const NEW="const __cb=new Map();const cl=cands.length?cands.map(c=>c.id+' -- '+c.side+' -- '+c.kind+' '+c.n+' -- EARLIER ['+c.earlier_round+'] \"'+c.earlier_q+'\" -- CLOSING ['+c.closing_round+'] \"'+c.closing_q+'\" -- named by '+c.by+(c.why?': '+c.why:'')+(()=>{const k=c.closing_round+'|'+c.closing_q;if(__cb.has(k))return '\\n   CLOSING BLOCK: as under '+__cb.get(k)+'.';const b=cecBlock(F[CEC_RK[c.closing_round]],c.closing_q);if(b)__cb.set(k,c.id);return b?'\\n   CLOSING BLOCK (the closing sentence with the rows of its block, ['+c.closing_round+']):\\n   '+b.replace(/\\n/g,'\\n   '):'';})()).join('\\n'):'none'; /* pkgCRX: CLOSING BLOCK as in Close Enforcer Build */";
J2=J2.replace(OLD,NEW);JN.parameters.jsCode=J2;
fs.writeFileSync(OUT,JSON.stringify(w));console.log(JSON.stringify({judge_code_change:J2.length-J.length,judge_prompt_old:lit(J,'PROMPT0').length,judge_prompt_new:JP.length,close_enforcer_changed:CN.parameters.jsCode!==C}));
