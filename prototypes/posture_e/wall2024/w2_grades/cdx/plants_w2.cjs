// W2 grade of pkgCLK rev 3: plants M1-M9 (claim Wall 4610). Run from wall2024/.
const {LIVE,CAND,load,rec}=require(__dirname+'/h.cjs');
const RD0=load('ex34852_full.json');const SENT='A man who knew himself the father would have no cause to put her away, and the verse shows Joseph with that cause.';
const H2='## D2: Mary was a virgin when the conception took place (answers C3 and its presses)';
const X2=/CLOSE-CONTRADICTION: X2 -- DEFENDER -- LINK 3 -- CONFIRMED([^\n]*)/;
const P=async(name,{cr4,reply})=>{const rd=JSON.parse(JSON.stringify(RD0));const F=rd['Final Output'][0].data.main[0][0].json;
 if(cr4)F.cr4=cr4(F.cr4);const c=rd['Close Enforcer Call deepseek'][0].data.main[0];if(reply)c[0].json.choices[0].message.content=reply(c[0].json.choices[0].message.content);
 const rd2=JSON.parse(JSON.stringify(rd));const a=await rec(LIVE,rd),b=await rec(CAND,rd2);console.log('##',name,'\n live',JSON.stringify(a),'\n cand',JSON.stringify(b));};
const moveSent=(t,toHeadIdx)=>{const L=t.split('\n');const i=L.findIndex(l=>l.includes(SENT));const line=L.splice(i,1)[0];const j=L.findIndex(l=>l.startsWith(toHeadIdx));L.splice(j+1,0,'',line);return L.join('\n');};
(async()=>{
await P('M0 control (stored)',{});
await P('M1 heading naming two links',{cr4:t=>t.replace(H2,'## D2 and D3: Mary was a virgin when the conception took place')});
await P('M2 reply quotes only the first half of the sentence',{reply:r=>r.replace(SENT,'A man who knew himself the father would have no cause to put her away')});
await P('M3 heading "## LINK 2:"',{cr4:t=>t.replace(H2,'## LINK 2: Mary was a virgin when the conception took place')});
await P('M4 "---" rule between D2 heading and sentence',{cr4:t=>{const L=t.split('\n');const i=L.findIndex(l=>l.includes(SENT));L.splice(i,0,'---','');return L.join('\n');}});
await P('M5 CHALLENGER NOT A CONTRADICTION on the same two quotations',{reply:r=>r.replace(X2,(m,rest)=>m+'\nCLOSE-CONTRADICTION: X9 -- CHALLENGER -- LINK 2 -- NOT A CONTRADICTION'+rest)});
await P('M6 sentence moved into the D3 block (reply already right)',{cr4:t=>moveSent(t,'## D3:')});
await P('M7 empty closing round',{cr4:t=>''});
await P('M8a reply with straight quote where close has curly (none in this sentence: apostrophe test on X1)',{reply:r=>r.replace("the child's descent","the child’s descent")});
await P('M8b close sentence with curly apostrophe, reply straight',{cr4:t=>t.replace(SENT,SENT.replace('A man who knew himself','A man who knew himself’s'))});
await P('M9 two NEW CONFIRMED on LINK 3: one sentence in D2, one in D3',{reply:r=>r.replace(X2,(m,rest)=>'CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 3 -- CONFIRMED'+rest+'\nCLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 3 -- CONFIRMED -- EARLIER [CR3] "I drop the claim that a father would never have thought of putting her away." -- CLOSING [round 4] "being (as was supposed) the son of Joseph, which was [the son] of Heli." -- planted.')});
})();
