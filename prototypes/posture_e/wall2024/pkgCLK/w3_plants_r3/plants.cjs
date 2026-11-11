const {LIVE,CAND,load,rec}=require('./h.cjs');
const RD0=load('ex34852_full.json');const SENT='A man who knew himself the father would have no cause to put her away, and the verse shows Joseph with that cause.';
const H2='## D2: Mary was a virgin when the conception took place (answers C3 and its presses)';
const P=async(name,{cr4,reply,dr4,dr3,gr2,cr3})=>{const rd=JSON.parse(JSON.stringify(RD0));const F=rd['Final Output'][0].data.main[0][0].json;
 if(cr4)F.cr4=cr4(F.cr4);if(dr4)F.dr4=dr4(F.dr4);if(dr3)F.dr3=dr3(F.dr3);if(cr3)F.cr3=cr3(F.cr3);
 const c=rd['Close Enforcer Call deepseek'][0].data.main[0];if(reply)c[0].json.choices[0].message.content=reply(c[0].json.choices[0].message.content);
 const rd2=JSON.parse(JSON.stringify(rd));const a=await rec(LIVE,rd),b=await rec(CAND,rd2);console.log('##',name,'\n live',JSON.stringify(a),'\n cand',JSON.stringify(b));};
(async()=>{
await P('C0 control',{});
await P('C1 heading with no link ("## Answers")',{cr4:t=>t.replace(H2,'## Answers on the virgin conception')});
await P('C2 heading names two links',{cr4:t=>t.replace(H2,'## D2 and D3: the virgin and the putting away')});
await P('C3 heading "LINK 2 (D2)"',{cr4:t=>t.replace(H2,'## LINK 2 (D2): Mary was a virgin')});
await P('C4 heading "Answers on D2"',{cr4:t=>t.replace(H2,'## Answers on D2')});
await P('C5 heading line removed (falls to the D1 heading above)',{cr4:t=>t.replace(H2+'\n','')});
await P('C6 sentence split across two lines',{cr4:t=>t.replace('no cause to put her away, and','no cause to put her away,\nand')});
await P('C7 same sentence also earlier in the D1 block',{cr4:t=>{const i=t.indexOf('## D1');const j=t.indexOf('\n',t.indexOf('**ANSWER: Matthew 1:20 -- D1 --**'));return t.slice(0,j)+'\n- [L4] '+SENT+t.slice(j);}});
await P('C8 bold heading, not markdown "**D2:**"',{cr4:t=>t.replace(H2,'**D2: Mary was a virgin**')});
await P('C9 closing quote with "..."',{reply:r=>r.replace('"A man who knew himself the father would have no cause to put her away, and the verse shows Joseph with that cause."','"A man who knew himself the father would have no cause ... shows Joseph with that cause."')});
await P('C10 NEW pair answered twice: CONFIRMED and NOT A CONTRADICTION, same link 3',{reply:r=>r.replace(/X2 -- DEFENDER -- LINK 3 -- CONFIRMED([^\n]*)/,(m,rest)=>'NEW -- DEFENDER -- LINK 3 -- CONFIRMED'+rest+'\nCLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 3 -- NOT A CONTRADICTION'+rest)});
await P('C11 challenger side: line on C3, closing under "## C2" heading of dr4',{reply:r=>r+'\nCLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK 3 -- CONFIRMED -- EARLIER [DR3] "Evident in Hebrews 7:14 is the evidence of loins, a fathers line." -- CLOSING [DR4] "the planted closing sentence for the challenger side stands here." -- why.',
  dr4:t=>t+'\n\n## C2: planted block\n\nthe planted closing sentence for the challenger side stands here.\n', dr3:t=>t});
})();
