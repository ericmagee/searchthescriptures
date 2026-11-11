const {LIVE,CAND,load,rec}=require('./h.cjs');
const RD0=load('ex34852_full.json');const SENT='A man who knew himself the father would have no cause to put her away, and the verse shows Joseph with that cause.';
const H2='## D2: Mary was a virgin when the conception took place (answers C3 and its presses)';
const P=async(name,{cr4,reply})=>{const rd=JSON.parse(JSON.stringify(RD0));const F=rd['Final Output'][0].data.main[0][0].json;
 if(cr4)F.cr4=cr4(F.cr4);const c=rd['Close Enforcer Call deepseek'][0].data.main[0];if(reply)c[0].json.choices[0].message.content=reply(c[0].json.choices[0].message.content);
 const rd2=JSON.parse(JSON.stringify(rd));const a=await rec(LIVE,rd),b=await rec(CAND,rd2);console.log('##',name,'\n live',JSON.stringify(a),'\n cand',JSON.stringify(b));};
const X2=/CLOSE-CONTRADICTION: X2 -- DEFENDER -- LINK 3 -- CONFIRMED([^\n]*)/;
const moveSent=(t,f)=>{const i=t.indexOf(SENT);const a=t.lastIndexOf('\n',i)+1;let e=t.indexOf('\n',i);if(e<0)e=t.length;const line=t.slice(a,e);const rest=t.slice(0,a)+t.slice(e+1);return f(rest,line);};
(async()=>{
await P('R1 X2 CONFIRMED on LINK 3 + NEW NOT A CONTRADICTION same quotations on LINK 2',{reply:r=>r.replace(X2,(m,rest)=>m+'\nCLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 2 -- NOT A CONTRADICTION'+rest)});
await P('R2 two NEW rows CONFIRMED same quotations, LINK 3 and LINK 2',{reply:r=>r.replace(X2,(m,rest)=>'CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 3 -- CONFIRMED'+rest+'\nCLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 2 -- CONFIRMED'+rest)});
await P('R3 bold lead on the quotation line',{cr4:t=>t.replace(SENT,'**D5 also stands.** '+SENT)});
await P('R4 quotation on the first line under the heading',{cr4:t=>moveSent(t,(rest,line)=>rest.replace(H2,H2+'\n'+line))});
await P('R5 quotation inside the heading line',{cr4:t=>t.split(SENT).join('').replace(H2,'## D2: '+SENT)});
await P('R6 CRLF with bold heading',{cr4:t=>t.replace(H2,'**D2: Mary was a virgin**').replace(/\n/g,'\r\n')});
await P('R7 reply on LINK 2 plus NOT A CONTRADICTION on other quotations',{reply:r=>r.replace('X2 -- DEFENDER -- LINK 3','X2 -- DEFENDER -- LINK 2')});
})();
