// Run 33014 chatgpt K-G4 x3 (W2): does the cure reader read chatgpt's CORRECTED RESULT line? Reply lines from debate_enforcer_log 5708 full_reply.
// Run from wall2024/: node pkgGD/probe_33014/probe.cjs
const fs=require('fs');const s=fs.readFileSync('pkgGDUP/patched/Alternate_Merge.js','utf8');const lib=s.slice(0,s.indexOf("const AM=$('Alternate Merge Seat')"));
const M=new Function('$','$input',lib+'\nreturn {cureLines,cureReasoned};')(()=>{throw new Error('offline');},null);
const t=fs.readFileSync('pkgGD/probe_33014/reply_chatgpt_kg4.txt','utf8');
for(const [name,txt] of [['as written',t],['tag only (reason line removed)',t.replace(/^(CORRECTED RESULT: HELD-1) -- .*$/m,'$1')]]){const o=M.cureLines(txt);
 const rsn=M.cureReasoned(o,[]);console.log(name+': result lines read '+o.result.length+'; malformed '+JSON.stringify(o.malformed.map(l=>l.slice(0,60)))+'; withdrawn '+o.withdrawn.map(w=>w.link).join(', ')+'; reasoned '+[...rsn].join(', '));
 console.log('   => '+(o.result.length!==1?'all 3 RETRACTED refused: "RETRACTED without exactly one CORRECTED RESULT line"':o.withdrawn.every(w=>rsn.has(w.link.toUpperCase()))?'all 3 retractions counted (CURED)':'retractions refused for no reason'));}
