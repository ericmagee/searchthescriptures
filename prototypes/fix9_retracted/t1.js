const fs=require('fs');
function load(f){const c=fs.readFileSync(f,'utf8');const cut=c.indexOf("const PP=$('Panel Payloads')");return new Function(c.slice(0,cut)+'\nreturn {cureLines};')();}
const reply=JSON.parse(fs.readFileSync('glm_reply.json','utf8'));
const cases=[
 ['GLM 32341 D3 (should withdraw)', reply.split('\n')[0], true],
 ['GLM 32341 D5 (should withdraw)', reply.split('\n')[2], true],
 ['regrade to broken (should refuse)', 'RETRACTED: D3 vs C4 -- regraded CHALLENGER LINK BROKEN -- [DR3] left Matthew 1:25 unanswered', false],
 ['stays broken (should refuse)', 'RETRACTED: D3 vs C4 -- the line stays CHALLENGER LINK BROKEN', false],
 ['plain broken (should refuse)', 'RETRACTED: D2 vs C1 -- DEFENDER LINK BROKEN', false],
 ['not broken form (should withdraw)', 'RETRACTED: D2 vs C1 -- regraded UNDERDETERMINED, not a LINK BROKEN', true],
];
for(const f of ['base/Panel Cure Check.js','new/Panel Cure Check.js']){const {cureLines}=load(f);console.log('==',f);
 for(const [n,l,want] of cases){const o=cureLines(l);const got=o.withdrawn.length===1;console.log((got===want?'PASS ':'FAIL ')+n+' withdrawn='+o.withdrawn.length+' malformed='+o.malformed.length);}
 const all=cureLines(reply);console.log('full GLM reply: withdrawn',all.withdrawn.map(w=>w.link+':'+w.regrade).join(','),'malformed',all.malformed.length);}
