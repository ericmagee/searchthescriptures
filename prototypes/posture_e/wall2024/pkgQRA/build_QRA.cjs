// pkgQRA rev 2 (W3; rev 1 FAILED W2's grade, Wall 3962, W1 agreeing 3968: the paragraph lacked Commitment 9's disregard clause, so an answer
// given after the close could bring new support; W2's sentence added word for word; "each debater answered" corrected).
// pkgQRA rev 1 (W3; coordinator 02:29Z 11-10, dry regrade finding 9 of Wall 3958). ONE node: Judge Contradiction Build.
// Gap: the debaters' answers in the question round (item C, pkgQRC) were read by no enforcer. The closing enforcer runs before the question
// round; the judge contradiction check runs after it but its prompt held the eight rounds only, so the enforcer answered a judge's contradiction
// question candidate without the debater's own answer to that question.
// Change: when QR Merge ran and holds an answer to a contradiction question (earlier_round and earlier_quote set, round = that side's round 4),
// the answer is printed after that side's rounds, under the two passages it was asked about and the candidate id it belongs to, and the prompt
// gains one paragraph that states the operator's rule already served to the judges (Commitment 9: "Its answer cannot withdraw either passage").
// With no such answer the prompt is byte-equal to the base. Nothing else changes: candidates, the Record's code confirmation, the log rows.
// LIMIT (not built): a NEW contradiction made inside an answer (answer against a round) is still no candidate; candidates close in round 4 only.
//   node pkgQRA/build_QRA.cjs <base fetch-back> <out>
const fs=require('fs');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};const [,,FB,OUT]=process.argv;if(!FB||!OUT)die('usage: build_QRA.cjs <base> <out>');
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');
const A1="const R=(lab,k)=>'=== ['+lab+'] ===\\n'+(String(F[k]||'').trim()||'(no text)');";
const B1=String.raw`/* pkgQRA (W3): each debater's answer to a judge's contradiction question (item C) goes to the enforcer with the candidate it answers */
let QRA={DEFENDER:[],CHALLENGER:[]};try{if($('QR Merge').isExecuted)(($('QR Merge').first().json.qa)||[]).forEach(x=>{if(!x||!x.earlier_quote||!x.earlier_round)return;const sd=String(x.side||'').toUpperCase();if(!QRA[sd])return;const lr=String(x.round||'').toUpperCase(),er=String(x.earlier_round).toUpperCase();if(lr!==CEC_PRE[sd]+'4')return;
 const a=String(x.answer==null?'':x.answer).replace(/\r/g,'').replace(/={3,}/g,'= =').replace(/#{4,}/g,'# #').replace(/CLOSE-CONTRADICTION/gi,'CLOSE CONTRADICTION').trim();if(!a)return;
 const c=cands.find(c=>c.side===sd&&c.earlier_round===er&&over(c.closing_q,x.quote)&&over(c.earlier_q,x.earlier_quote));
 QRA[sd].push({id:c?c.id:null,judge:String(x.judge||''),er,eq:String(x.earlier_quote),lr,lq:String(x.quote||''),q:String(x.question||'').trim(),a:a.length>6000?a.slice(0,6000)+' [answer cut at 6000 characters]':a});});}catch(e){QRA={DEFENDER:[],CHALLENGER:[]};}
const qraN=QRA.DEFENDER.length+QRA.CHALLENGER.length;
const qraBlock=sd=>QRA[sd].length?'\n\n=== ['+CEC_PRE[sd]+'Q -- THE '+sd+'\'S ANSWERS TO THE JUDGES\' CONTRADICTION QUESTIONS, GIVEN AFTER ITS CLOSING ROUND; NOT A ROUND, NEVER QUOTE FROM IT] ===\n'+QRA[sd].map((x,i)=>'ANSWER '+(i+1)+(x.id?' (candidate '+x.id+')':' (its pair was answered before the judges sat)')+' -- asked by judge '+x.judge+' about EARLIER ['+x.er+'] "'+x.eq+'" and CLOSING ['+x.lr+'] "'+x.lq+'"\nThe question: '+x.q+'\nThe '+sd.toLowerCase()+'\'s answer:\n'+x.a).join('\n\n'):'';
const QRA_P="\nAfter the closing rounds the judges put contradiction questions to the debaters, and the debater asked answered. Those answers are printed after that debater's rounds, each under the two passages it was asked about. Read the answer before you answer its candidate: it may show how the two passages can both be true. Read it only as an explanation of the two passages: anything beyond them, and any verse not already cited in the rounds, is disregarded. An answer cannot withdraw either passage, and it does not undo a contradiction made in the closing round: where the two passages as they stand in the rounds cannot both be true, the candidate is CONFIRMED whatever the debater says afterwards. Quote only from the rounds, never from an answer.";
const PROMPTQ=qraN&&PROMPT.includes('\nReply with one line per contradiction')?PROMPT.replace('\nReply with one line per contradiction',QRA_P+'\nReply with one line per contradiction'):PROMPT;
`+A1;
const E=[[A1,B1],
 ["const user=PROMPT+'\\n\\nCANDIDATES ALREADY NAMED","const user=PROMPTQ+'\\n\\nCANDIDATES ALREADY NAMED"],
 ["['CR4 -- THE DEFENDER\\'S CLOSING ROUND','cr4']].map(x=>R(x[0],x[1])).join('\\n\\n')","['CR4 -- THE DEFENDER\\'S CLOSING ROUND','cr4']].map(x=>R(x[0],x[1])).join('\\n\\n')+qraBlock('DEFENDER')"],
 ["['DR4 -- THE CHALLENGER\\'S CLOSING ROUND','dr4']].map(x=>R(x[0],x[1])).join('\\n\\n');","['DR4 -- THE CHALLENGER\\'S CLOSING ROUND','dr4']].map(x=>R(x[0],x[1])).join('\\n\\n')+qraBlock('CHALLENGER');"],
 ["return [{json:{cec_skip:false,cands_only:true,answered_before,body,","return [{json:{cec_skip:false,cands_only:true,answered_before,qra:{DEFENDER:QRA.DEFENDER.length,CHALLENGER:QRA.CHALLENGER.length,matched:QRA.DEFENDER.concat(QRA.CHALLENGER).filter(x=>x.id).length},body,"]];
const nm='Judge Contradiction Build';const n=d.nodes.find(z=>z.name===nm);if(!n)die('no node '+nm);let s=n.parameters.jsCode;if(s.includes('pkgQRA'))die(nm+' already has pkgQRA');
for(const [a,b] of E){const k=s.split(a).length-1;if(k!==1)die(nm+': '+k+' hits for '+a.slice(0,70));const i=s.indexOf(a);s=s.slice(0,i)+b+s.slice(i+a.length);}
new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));console.log(OUT+': 418 nodes; changed '+nm);
