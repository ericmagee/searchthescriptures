// pkgKSP unit test: KSC.items on the 33411 lines of all four seats, the 33175 case and controls; base vs patched Extract Independent Verdict.
const fs=require('fs');const load=f=>{const s=fs.readFileSync(f,'utf8');const e=s.indexOf('return {LIVE,items,cure,note,keystone,conceded,entries,premiseMap,counts};})();');
 return new Function(s.slice(0,e)+'return {LIVE,items,cure,note,keystone,conceded,entries,premiseMap,counts};})();return KSC;')();};
const B=load('pkgKSP/base_s46/Extract_Independent_Verdict.js'),P=load('pkgKSP/patched/Extract_Independent_Verdict.js');let ok=0,bad=0;
const T=(cl)=>'RESULT: DEFENDER WINS -- x\nKEYSTONE: D6 -- STANDS\nCONCEDED LINKS: '+cl+'\nCHALLENGE STANDING: SELF-SUPPORTED -- L=6 c=0 -- y';
const DR2='UNSUPPORTED-L4 PREMISES\n1. LINK 2: a\n2. LINK 3: b\n3. LINK 6: c';
const C=[['33411 gemini','1 -- Premise 2 CONCEDED (stated): "[CR3] LINK 6 [premise 2]: CONCEDED"',0],
 ['33411 chatgpt','1 -- Premise 2, LINK 6: CONCEDED (stated) "[CR3] LINK 6 [premise 2]: CONCEDED"',0],
 ['33411 grok','1 -- Premise 2 (LINK 6): CONCEDED (stated) "[CR3] LINK 6 [premise 2]: CONCEDED"',0],
 ['33411 sol','1 -- Premise 2, charged against D6: CONCEDED (stated) "[CR3] LINK 6 [premise 2]: CONCEDED"',0],
 ['33411 sol, actual full line (ends "not a withdrawal of the whole declared D6.")','1 -- Premise 2, charged against D6: CONCEDED (stated), the claimed Davidic flesh route through Mary; premises 1, 3, 4, 5 and 6 are spared because their retained inferences have exhibited footing and their proven witnesses are answered. This counts the surrendered limb, not a withdrawal of the whole declared D6.',0],
 ['bare premise number "-- 6 CONCEDED" is not a link','1 -- 6 CONCEDED',0],
 ['Premise 2 of LINK 6 CONCEDED','1 -- Premise 2 of LINK 6: CONCEDED (stated)',0],
 ['33175 LINK 6 UNEXHIBITED (the rule\'s own case)','1 -- LINK 6: UNEXHIBITED',1],
 ['LINK 6 WITHDRAWN','1 -- LINK 6 WITHDRAWN (stated) "[CR3] D6: WITHDRAWN"',1],
 ['D6 CONCEDED','1 -- D6: CONCEDED (stated)',1],
 ['premise of the [DR2] list on LINK 6 (base raised it via the list; now a premise never counts)','1 -- Premise 3 UNEXHIBITED',0],
 ['another link conceded','1 -- LINK 4: CONCEDED',0],
 ['zero count','0',0]];
for(const [name,cl,want] of C){const b=B.items(T(cl),DR2).length,p=P.items(T(cl),DR2).length;const pass=p===want;pass?ok++:bad++;console.log((pass?'OK   ':'FAIL ')+name+': base '+b+', patched '+p+' (want '+want+')');}
const it={n:6,tag:'CONCEDED',via:'LINK 6',pmap:{}};const ksc={ksc:it};
for(const [name,to,want] of [['cure: CONCEDED line that no longer counts LINK 6','CONCEDED LINKS: 1 -- Premise 2, charged against D6: CONCEDED (stated)','CURED'],['cure: still counts LINK 6','CONCEDED LINKS: 1 -- LINK 6: CONCEDED','UNCURED'],['cure: KEYSTONE WITHDRAWN','KEYSTONE: D6 -- WITHDRAWN -- the defender withdrew it','CURED']]){
 const r=P.cure(ksc,{ans:'CHANGE',to});const pass=r.status===want;pass?ok++:bad++;console.log((pass?'OK   ':'FAIL ')+name+': '+r.status+' ('+r.why+')');}
console.log(ok+' OK, '+bad+' FAIL');
