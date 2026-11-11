// W1 grade of pkgEKR: the two tests (__ekK for E-KEY, __ekR for E-RES) taken from Shared Library line 3100 of the parent, on planted cases.
const fs=require('fs');let j=JSON.parse(fs.readFileSync(process.argv[2]||'/mnt/project-files/wall2024/parent_s141_JOINT_EKR.json','utf8'));j=j.data||j;j=j.workflow||j;
const T=j.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const L=JSON.parse(T.slice(a+8,b))[3100];
const mk=cc=>new Function('__cc',L.replace(/^const KG=\[\],/,'const ')+';return {K:__ekK,R:__ekR};')(new Set(cc));
const P=[ // [kind, input, confirmed set, expected: true = set aside (not asked)]
 ['K',{link:'D5',grade:'BROKEN'},['DEFENDER 5'],true,'keystone BROKEN on the confirmed link'],
 ['K',{link:'D5',grade:'BROKEN'},['DEFENDER 3'],false,'keystone BROKEN, another link confirmed'],
 ['K',{link:'D5',grade:'STANDS'},['DEFENDER 5'],false,'keystone STANDS on the confirmed link (W2 limit b: still asked)'],
 ['K',{link:'D5',grade:'BROKEN'},['CHALLENGER 5'],false,'keystone BROKEN, only the challenger link 5 confirmed'],
 ['K',{link:'D5',grade:'BROKEN'},[],false,'keystone BROKEN, nothing confirmed'],
 ['K',{link:'D5',grade:'WITHDRAWN'},['DEFENDER 5'],false,'keystone WITHDRAWN on the confirmed link'],
 ['R','RESULT: CHALLENGER WINS -- D5 is broken by the record\'s closing contradiction rule.',['DEFENDER 5'],true,'the 35173 form'],
 ['R','RESULT: CHALLENGER WINS -- the defender\'s own contradictory readings break its timing link.',['DEFENDER 1'],true,'"contradictory"'],
 ['R','RESULT: CHALLENGER WINS -- D3 is broken by a confirmed closing contradiction.',['DEFENDER 5'],true,'names D3 while D5 is confirmed (W2 limit a)'],
 ['R','RESULT: CHALLENGER WINS -- no contradiction is found; D3 fails on an unanswered press.',['DEFENDER 5'],true,'NEW LIMIT: a negated "contradiction" is set aside'],
 ['R','RESULT: CHALLENGER WINS -- D5 is broken by a confirmed closing contradiction.',['CHALLENGER 3'],false,'only a challenger link confirmed'],
 ['R','RESULT: DEFENDER WINS -- the challenger\'s closing contradiction breaks C3.',['DEFENDER 5'],false,'DEFENDER WINS'],
 ['R','RESULT: UNDERDETERMINED -- the contradiction is noted.',['DEFENDER 5'],false,'UNDERDETERMINED'],
 ['R','RESULT: CHALLENGER WINS -- D5 is broken.',['DEFENDER 5'],false,'no contradiction word: still asked'],
];
let ok=0;for(const [k,x,cc,want,d] of P){const f=mk(cc);const got=k==='K'?f.K(x):f.R(x);const r=got===want?'OK':'WRONG';if(r==='OK')ok++;console.log(r.padEnd(6),k==='K'?'E-KEY':'E-RES',got?'set aside':'asked    ','|',d);}
console.log('plants',P.length,'as expected',ok);
