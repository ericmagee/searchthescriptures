# Rev 9 DoD 20 flow patch (Worker_E; amendments 3 and 4, BB-7615, BB-7621): Build Save Body, Panel Payloads, Alternate Payloads. Each anchor once.
def edit(P,pairs):
  s=open(P).read()
  for a,b in pairs: assert s.count(a)==1,(P,a[:70],s.count(a)); s=s.replace(a,b)
  open(P,'w').write(s)
edit('new13/Build_Save_Body.js',[
("RVW.forEach(x=>{const k=__FK(x);let y=x.replace(/^\\[((?:EXTRACTOR|AUDIT) v\\d+): /,'[$1: SINGLE JUDGE (second opinion): ');",
 "// BB-7397 rev 9 DoD 20 (i): the row's four standings fields are inserted null (derive_debate_outcome writes the counted panel's at the first\n// stamp), so a single-judge line saying its value was stored says where the value is kept instead.\nRVW.forEach(x=>{const k=__FK(x);let y=x.replace(/^\\[((?:EXTRACTOR|AUDIT) v\\d+): /,'[$1: SINGLE JUDGE (second opinion): ').replace(/STATED VALUE STORED\\./,\"STATED VALUE KEPT IN THE SINGLE JUDGE'S TEXT.\");"),
("return [{json:{...d,premises_vs_defender:vsDef.n,premises_vs_challenger:vsCh.n,saveBody:{",
 "// BB-7397 rev 9 DoD 20 (v): the single judge's four values ride beside saveBody, for the same-model check of Panel and Alternate Payloads.\nconst sj_values={challenge_standing:d.challenge_standing||null,challenger_conceded_links:(typeof d.challenger_conceded_links==='number'&&isFinite(d.challenger_conceded_links)?d.challenger_conceded_links:null),defense_standing:d.defense_standing||null,conceded_links:(typeof d.conceded_links==='number'&&isFinite(d.conceded_links)?d.conceded_links:null)};\nreturn [{json:{...d,premises_vs_defender:vsDef.n,premises_vs_challenger:vsCh.n,sj_values,saveBody:{"),
("challenge_standing:d.challenge_standing||null,challenger_conceded_links:(typeof d.challenger_conceded_links==='number'&&isFinite(d.challenger_conceded_links)?d.challenger_conceded_links:null),defense_standing:d.defense_standing||null,conceded_links:(typeof d.conceded_links==='number'&&isFinite(d.conceded_links)?d.conceded_links:null),queue_id:",
 "challenge_standing:null,challenger_conceded_links:null,defense_standing:null,conceded_links:null,queue_id:"),
])
for P in ['new13/Panel_Payloads.js','new13/Alternate_Payloads.js']:
  edit(P,[
("let SJ=null;try{if(RGL){SJ=$('Regrade Row').all().map(i=>i.json).find(r=>r&&r.id)||null;}else if($('Build Save Body').isExecuted){SJ=$('Build Save Body').first().json.saveBody||null;}}catch(e){SJ=null;}",
 "// BB-7397 rev 9 DoD 20 (v): on a live run the single judge's four values come from Build Save Body's sj_values (saveBody carries null for them);\n// on a regrade the row's four are the single judge's only while panel_verdict is null; on a stamped row they are the panel's, so the check\n// compares the VOID counts only and its line says so.\nlet SJ=null;try{if(RGL){const RR=$('Regrade Row').all().map(i=>i.json).find(r=>r&&r.id)||null;SJ=RR?(RR.panel_verdict==null?RR:Object.assign({},RR,{defense_standing:null,challenge_standing:null,conceded_links:null,challenger_conceded_links:null,sj_void_only:true})):null;}else if($('Build Save Body').isExecuted){const B=$('Build Save Body').first().json;SJ=B.saveBody?Object.assign({},B.saveBody,B.sj_values||{}):null;}}catch(e){SJ=null;}"),
(" return ['[AUDIT v1: SAME-MODEL DIVERGENCE -- seat '+p.judge_seat+' and the single judge both ran '+p.judge_api_model+'; seat vs single judge: '+diffs.join('; ')+'. Counts only; premise ids are not compared. REVIEW THIS ROW.]'];}",
 " return ['[AUDIT v1: SAME-MODEL DIVERGENCE -- seat '+p.judge_seat+' and the single judge both ran '+p.judge_api_model+'; seat vs single judge: '+diffs.join('; ')+'. Counts only; premise ids are not compared.'+(SJ.sj_void_only?' Stamped row: VOID counts only.':'')+' REVIEW THIS ROW.]'];}"),
  ])
print('ok')
