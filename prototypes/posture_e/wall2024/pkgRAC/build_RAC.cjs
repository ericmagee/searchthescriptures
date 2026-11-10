// Built on live s106 (the per-side closing enforcer, pkgCSS rev 2).
// pkgRAC rev 2 (W3; rev 2 = W4's FAIL of Wall 4117: id checked against side and closing quotation; the operator's "option 1" of 08:27 CST 2026-11-10 on the ask of 20:30 CST 2026-11-09): every pair the close-round reversal
// check and the anti-cheat check find goes to the closing enforcer as a candidate, before any judge. A pair the enforcer confirms (and Close
// Enforcer Record confirms by code) breaks its link and is shown in the existing CONFIRMED CLOSING CONTRADICTIONS block; it leaves the two check
// blocks. A pair the enforcer answers NOT A CONTRADICTION keeps its block, which ends with the approved sentence. A pair the enforcer did not
// examine keeps its block with the second half of that sentence only. The "is DISREGARDED" wording leaves both blocks.
// Parts: (1) four connections, so the anti-cheat call runs before the closing enforcer; (2) Close Enforcer Build adds the candidates;
// (3) Close Enforcer Record reads their ids and logs a pair that could not be sent; (4) Panel Build and Build Independent Verdict print the blocks.
//   node pkgRAC/build_RAC.cjs <fetch-back> <out parent>
const fs=require('fs');const [,,FB,OUT]=process.argv;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;
const size={};const edit=(name,subs)=>{const n=d.nodes.find(x=>x.name===name);if(!n)die('no node '+name);let s=n.parameters.jsCode;const s0=s;
 for(const [a,b,w] of subs){const k=s.split(a).length-1;if(k!==1)die(name+' '+w+': '+k+' hits');s=s.split(a).join(b);}
 new Function('$','$input',s);n.parameters.jsCode=s;size[name]=[s0.length,s.length];};

// (1) connections
const C=d.connections;const rewire=(from,out,was,to)=>{const a=C[from]&&C[from].main&&C[from].main[out];if(!a||a.length!==1||a[0].node!==was)die('connection '+from+'#'+out+' is not ['+was+']: '+JSON.stringify(a));a[0].node=to;};
rewire('Quote Report',0,'Close Enforcer Build','Anticheat Build');
rewire('Anticheat Only?',1,'Panel Build','Close Enforcer Build');
rewire('Regrade After Quotes?',0,'Anticheat Build','Panel Build');
rewire('Check Save',0,'Anticheat Build','Panel Build');

// (2) Close Enforcer Build: candidates from the two checks
edit('Close Enforcer Build',[
 [`const links=cecLinks(F);const cands=cecOracle(F);`,
  `const links=cecLinks(F);const cands=cecOracle(F);const not_sent=[]; /* pkgRAC: pairs of the anti-cheat check (A<n>) and the reversal check (R<n>) are candidates; one not sent is logged */
const racFit=(q,ks)=>{for(const x of [q].concat(String(q).split(/\\.\\.\\.|…/).sort((a,b)=>b.length-a.length)))for(const k of ks)if(cecStands(x,F[CEC_RK[k]]))return [k,x.trim()];return null;};
const racAdd=(id,sd,eq,cq,by,why)=>{const side=sd==='D'?'DEFENDER':'CHALLENGER',P=CEC_PRE[side],e=racFit(eq,[P+'1',P+'2',P+'3']),c=racFit(cq,[P+'4']);if(e&&c)cands.push({id,side,by,kind:'LINK',n:'(you name it)',earlier_round:e[0],earlier_q:e[1],closing_round:P+'4',closing_q:c[1],why});else not_sent.push(id+' '+side+' ('+by+'): '+(e?'the closing':'the earlier')+' quotation stands in no single round');};
try{if($('Anticheat Record').isExecuted){const A=($('Anticheat Record').first().json.acx||{}).reversed||{};for(const sd of ['D','C'])for(const r of A[sd]||[])racAdd('A'+String(r.id).replace(/\\D/g,''),sd,r.earlier_q,r.close_q,'the anti-cheat check',r.verse);}}catch(e){not_sent.push('the anti-cheat pairs: '+String(e&&e.message||e).slice(0,160));}
try{const PB=$('Panel Build').params.jsCode,a=PB.indexOf('const REFP='),b=PB.indexOf('})();',PB.indexOf('const C4X=',a));if(a<0||b<a)throw new Error('Panel Build source holds no reversal check');const X=new Function(PB.slice(a,b+5)+';return C4X;')();for(const sd of ['D','C'])X.reversal(F,sd).forEach((v,i)=>racAdd('R'+(sd==='D'?1:2)+(i+1),sd,v.grant,v.close,'the close-round reversal check',''));}catch(e){not_sent.push('the reversal pairs: '+String(e&&e.message||e).slice(0,160));}`,'B1'],
 [`out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,missing_rounds:miss,`,`out.push({json:{cec_skip:false,side:sd,body,links,cands:cs,not_sent,missing_rounds:miss,`,'B2'],
]);

// (3) Close Enforcer Record: ids A<n> and R<n>; a pair that was not sent is logged NOT CHECKED
edit('Close Enforcer Record',[
 [`(X\\d+|J\\d+|NEW\\s*\\d*)`,`([XJAR]\\d+|NEW\\s*\\d*)`,'R1'],
 [` if(row.answer==='CONFIRMED'){const f=[];`,` /* pkgRAC rev 2: an A or R id counts only for its own pair */
 if(/^[AR]\\d/.test(row.id)){const c=cands.find(c=>c.id===row.id),a=cecN(row.closing_q),b=c?cecN(c.closing_q):'';if(!(c&&c.side===side&&a.split(' ').length>2&&(a.includes(b)||b.includes(a)))){row.why='(given id '+row.id+', which is not this pair) '+row.why;row.id='NEW';}}
 if(row.answer==='CONFIRMED'){const f=[];`,'R3'],
 [` .concat(RP.filter(rp=>!rp.n).map(rp=>log({item:(rp.none?`,` .concat((B.not_sent||[]).map(t=>log({item:'NOT SENT',flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,cure_status:'NOT CHECKED',cure_reason:'pkgRAC: a pair found by a code check did not reach the enforcer: '+t})))\n .concat(RP.filter(rp=>!rp.n).map(rp=>log({item:(rp.none?`,'R2'],
]);

// (3b) rev 2 (W1 note 3): the two anti-cheat nodes now run before the single judge; a failure in either skips the check and never stops the debate
const guard=(name,subs,fb)=>{edit(name,subs);const n=d.nodes.find(x=>x.name===name);const s='try{\n'+n.parameters.jsCode+'\n}catch(__e){const m=\''+name+' failed: \'+String(__e&&__e.message||__e).slice(0,200);return '+fb+';} /* pkgRAC */';new Function('$','$input',s);n.parameters.jsCode=s;size[name][1]=s.length;};
guard('Anticheat Build',[],`[{json:{acx_skip:true,why:m,items:[]}}]`);
guard('Anticheat Record',[[`let ACX_ONLY=false;try{`,`var ACX_ONLY=false;try{`,'G1']],`[{json:{acx_only:ACX_ONLY,acx:{skipped:true,why:m,rows:[],reversed:{D:[],C:[]},not_checked:[]}}}]`);

// (4) the two served blocks. C4X is the same text in both nodes and stays the same text.
const C4X_SUBS=[
 [` const note=(F,sd)=>{if(!cl(F,sd).trim())return '';const R=sd==='D'?'CR4':'DR4';let t='';const n=newToSide(F,sd);`,
  ` /* pkgRAC: the closing enforcer on a pair: 2 shown as confirmed, 1 answered no, 0 other */
 const rac=id=>{try{const c=$('Close Enforcer Record').first().json.cec;return c.confirmed.some(x=>x.id===id)?2:c.rows.some(x=>x.id===id&&x.answer==='NOT A CONTRADICTION')?1:0;}catch(e){return 0;}};
 const racs=(k,n)=>(k?'The closing enforcer examined '+(n>1?'these pairs':'this pair')+' and did not confirm a contradiction. ':'')+'The close sentence is not footing for any link; grade this side\\'s earlier answer on its own words, against the verse.';
 const note=(F,sd)=>{if(!cl(F,sd).trim())return '';const R=sd==='D'?'CR4':'DR4';let t='';const n=newToSide(F,sd);`,'X1'],
 [`  const v=reversal(F,sd);if(v.length)t+=`,`  const v=reversal(F,sd).map((x,i)=>({...x,k:rac('R'+(sd==='D'?1:2)+(i+1))})).filter(x=>x.k<2);if(v.length)t+=`,'X2'],
 [`. Where the close takes the grant back, the earlier grant stands and the close sentence is DISREGARDED as footing.]';`,`. '+racs(v.every(x=>x.k===1),v.length)+']';`,'X3'],
 [` return {newToSide,reversal,note};})();`,` return {newToSide,reversal,note,rac,racs};})();`,'X4'],
];
edit('Panel Build',C4X_SUBS.concat([
 [`const __ACX=sd=>{try{if(!$('Anticheat Record').isExecuted)return '';const A=$('Anticheat Record').first().json.acx||{};const L=((A.reversed||{})[sd]||[]);if(!L.length)return '';
 return L.map(r=>'\\n\\n[ANTI-CHEAT CHECK`,`const __ACX=sd=>{try{if(!$('Anticheat Record').isExecuted)return '';const A=$('Anticheat Record').first().json.acx||{};const L=((A.reversed||{})[sd]||[]).map(r=>({...r,k:C4X.rac('A'+String(r.id).replace(/\\D/g,''))})).filter(r=>r.k<2);if(!L.length)return '';
 return L.map(r=>'\\n\\n[ANTI-CHEAT CHECK`,'P1'],
 [`". The close sentence is disregarded; grade this side\\'s earlier answer on '+r.verse+' on its own words, against the verse.]').join('');}catch(e){return '';}};`,`". '+C4X.racs(r.k,1)+']').join('');}catch(e){return '';}};`,'P2'],
]));
// Build Independent Verdict: the single judge runs before the anti-cheat check today and never sees its block. After the reorder the check
// has run, so the block is switched off here to keep the single judge's prompt as it is; the reversal block gets the same new ending.
{const n=d.nodes.find(x=>x.name==='Build Independent Verdict');const s=n.parameters.jsCode;const a=s.indexOf(`const __ACX=sd=>{try{if(!$('Anticheat Record').isExecuted)return '';`),b=s.indexOf(`const __CEC=sd=>`);if(a<0||b<a||s.indexOf(`const __ACX=`,a+1)>=0)die('Build Independent Verdict __ACX not found once');
 n.parameters.jsCode=s.slice(0,a)+`const __ACX=sd=>''; /* pkgRAC: as before the reorder */\n`+s.slice(b);size['Build Independent Verdict']=[s.length,0];}
{const k=size['Build Independent Verdict'][0];edit('Build Independent Verdict',C4X_SUBS);size['Build Independent Verdict'][0]=k;}
{const x=n=>{const s=d.nodes.find(z=>z.name===n).parameters.jsCode;const i=s.indexOf('const C4X=');return s.slice(i,s.indexOf('})();',i));};if(x('Panel Build')!==x('Build Independent Verdict'))die('C4X differs between the two nodes');}
fs.writeFileSync(OUT,JSON.stringify(d));
let tot=0;for(const k in size){const [a,b]=size[k];tot+=b-a;console.log(k+' '+a+' -> '+b+' ('+(b-a>=0?'+':'')+(b-a)+')');}console.log('code total '+(tot>=0?'+':'')+tot+'; connections changed 4; nodes '+d.nodes.length);
