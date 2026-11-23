// ASK 537 open question 2 (W4): does a GAP line in the defender's close [CR4] change the pressed-witness ledger's answered test (pwAnswered, Library line 2128; PW_ANSR DEFENDER = CR2, CR3, CR4)?
// Library lines 864 (ciKeys), 1007-1009 and 2127-2128 (pwAnswered) of target_engine_531.json are compiled with REFP from its own MAP entry. Usage: node pwa537.js <engine.json> <part_ac.json>
const fs=require('fs');const [,,ENG,AC]=process.argv;const W=JSON.parse(fs.readFileSync(ENG,'utf8'));const T=W.nodes.find(y=>y.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const MR=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))).REFP;const RS=MR.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(RS.length!==MR.n)throw new Error('REFP length');
const pick=i=>{if(!/^(?:const ciKeys=|const PW_ORD=|const PW_PRESSR=|const PW_ANSR=|function pwAnswered\(|\s*return PW_ANSR\[)/.test(L[i]))throw new Error('line '+i+' moved: '+L[i].slice(0,40));return L[i];};
const SRC=[864,1007,1008,1009,2127,2128].map(pick).join('\n'); /* Library lines: ciKeys 864; PW_ORD, PW_PRESSR, PW_ANSR 1007-1009; pwAnswered 2127-2128 (as in Panel Payloads and the payload nodes) */
const api=new Function('REFP',SRC+'\nreturn {ciKeys,pwAnswered};')(new Function(RS+'\nreturn REFP;')());
const J=JSON.parse(fs.readFileSync(AC,'utf8'));const RD=(J.data&&J.data.resultData||J).runData;const F=RD['Final Output'].slice(-1)[0].data.main[0][0].json;
const R0={CR1:F.cr1,DR1:F.gr1,CR2:F.cr2,DR2:F.gr2,CR3:F.cr3,DR3:F.dr3,CR4:F.cr4,DR4:F.dr4};
// 1. 41418: every verse key pressed against the defender (in [DR1] or [DR2]); which are unanswered without [CR4], and does a GAP line naming the Oracle's own pressed verses flip any?
const pressedD=new Set([...api.ciKeys(R0.DR1||'')].concat([...api.ciKeys(R0.DR2||'')]));
const noCR4={...R0,CR4:''};const unNo=[...pressedD].filter(k=>!api.pwAnswered(k,'DEFENDER',noCR4));const unSt=[...pressedD].filter(k=>!api.pwAnswered(k,'DEFENDER',R0));
const own=[...api.ciKeys(R0.CR3.slice(R0.CR3.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED/i)))];
const gap=own.map(k=>'GAP: premise 1 "Verse 35 opens with \'The Holy Ghost shall come upon thee\' and so supplies the how of that conceiving." -- '+k+' -- UNANSWERED.').join('\n');
const RG={...R0,CR4:R0.CR4+'\n\n'+gap+'\n'};const unG=[...pressedD].filter(k=>!api.pwAnswered(k,'DEFENDER',RG));
console.log('41418: verse keys named in [DR1]/[DR2]: '+pressedD.size+'; unanswered with [CR4] empty: '+unNo.length+'; unanswered with stored [CR4]: '+unSt.length+' '+JSON.stringify(unSt));
console.log('41418: GAP lines for the '+own.length+' verses of the Oracle\'s own [CR3] list appended to [CR4]: unanswered now '+unG.length+'; flipped to answered: '+JSON.stringify(unSt.filter(k=>!unG.includes(k))));
// 2. Synthetic: a verse pressed against the defender in [DR2] and named by no later defender round; a [CR4] GAP line whose quoted opponent words carry that reference.
const K='Luke 1:34';const S={CR1:'Matthew 1:18 "Now the birth" opening.',DR1:'',CR2:'',DR2:'UNSUPPORTED-L4 PREMISES\n1. LINK 1: "x"\nPRESSED WITH:\nLuke 1:34 "How shall this be, seeing I know not a man?" -- MEANS: m',CR3:'',DR3:'',CR4:'',DR4:''};
const before=api.pwAnswered(K,'DEFENDER',S);const S2={...S,CR4:'GAP: premise 2 "the question of Luke 1:34 is about the throne" -- Acts 1:8 -- UNANSWERED.'};const after=api.pwAnswered(K,'DEFENDER',S2);
console.log('SYNTHETIC: '+K+' pressed in [DR2], not named later: answered '+before+'; after a [CR4] GAP line whose quoted words name '+K+': answered '+after);
const S3={...S,CR4:'GAP: premise 2 "the question is about the throne" -- Acts 1:8 -- UNANSWERED.'};console.log('SYNTHETIC: same, GAP line without the reference in its quote: answered '+api.pwAnswered(K,'DEFENDER',S3));
// rev 2 (W2 10655): the no-quote form naming a verse still unanswered against the defender in 41418.
for(const k of unSt){const RX={...R0,CR4:R0.CR4+'\n\nGAP: premise 1 [CR3] -- '+k+' -- UNANSWERED.\n'};console.log('41418 W2 form: GAP line naming '+k+' (unanswered against the defender) in [CR4]: answered '+api.pwAnswered(k,'DEFENDER',RX));}
{const RX={...R0,CR4:R0.CR4+'\n\nGAP: premise 1 [CR3] -- Luke 1:35 -- UNANSWERED.\n'};console.log('41418 W2 form, Oracle\'s own verse Luke 1:35: still unanswered '+[...pressedD].filter(k=>!api.pwAnswered(k,'DEFENDER',RX)).length+' (stored 4)');}
