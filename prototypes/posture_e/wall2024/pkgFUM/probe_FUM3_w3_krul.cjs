const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const a=s.indexOf('function fumKey2024'),b=s.indexOf('/* pkgFUM: the kept follow-up');const k0=s.indexOf('function krulMatch('),k1=s.indexOf('const KRUL_BAD');const f=new Function(s.slice(k0,k1)+s.slice(a,b)+';return fumKeep2024;')();
const R=[{rule:'K-RUL',side:'DEFENDER',link:'D2 vs C2'}],W=[{rule:'K-W',side:'CHALLENGER',link:'CHALLENGER DR3 LINK 3 #3'}];
const card=['RULING -- D2 vs C2 -- STANDS','CLAIM: x','NAMED BY: y','RULE: z','APPLIED: w'];
const cases={
'A RESPONSE, blank line, card':[['RESPONSE: K-RUL D2 vs C2 | card below','',...card].join('\n'),R],
'B card only (luna 27609 form)':[card.join('\n'),R],
'C card with bold labels':[['RESPONSE: K-RUL D2 vs C2 | card','**RULING** -- D2 vs C2 -- STANDS','**CLAIM:** x','**NAMED BY:** y','**RULE:** z','**APPLIED:** w'].join('\n'),R],
'D K-W bold label':['**RESPONSE: K-W CHALLENGER DR3 LINK 3 #3** | NOT HELD: "I drop the limb that names what Joseph knew"',W],
'E K-W lowercase':['Response: k-w challenger dr3 link 3 #3 | NOT HELD: "I drop the limb that names what Joseph knew"',W],
'F K-W rule with colon':['RESPONSE: K-W: CHALLENGER DR3 LINK 3 #3 | NOT HELD: q',W],
'G K-W #30 near key':['RESPONSE: K-W CHALLENGER DR3 LINK 3 #30 | NOT HELD: q',W],
'H K-W numbered list':['1. RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: q',W],
'I card under RESPONSE then stray RULING for other pair':[['RESPONSE: K-RUL D2 vs C2 | card',...card,'RULING -- D4 vs C1 -- FALLS','CLAIM: p','NAMED BY: q','RULE: r','APPLIED: s'].join('\n'),R],
};
for(const[k,[t,it]]of Object.entries(cases)){const o=f(t,it);console.log(k,'=> kept',o?o.split('\n').length:0,'|',JSON.stringify(o).slice(0,160));}
