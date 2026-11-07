// pkgCLR unit test on the built Send Back Build node library (CLR inside the KSC copy). Run from wall2024/: node pkgCLR/test_CLR.cjs
const fs=require('fs');const s=fs.readFileSync('pkgCLR/patched/Send_Back_Build.js','utf8');const i=s.indexOf('const CLR=(()=>{'),k=s.indexOf('const KSC=(()=>{');
const K=new Function(s.slice(i,s.indexOf('})();',k)+5)+';return KSC;')();let ok=0,bad=0;const out=[];const T=(n,c,d)=>{const l=(c?'OK  ':'FAIL')+' '+n+(d?' | '+d:'');console.log(l);out.push(l);c?ok++:bad++;};
const DR2='UNSUPPORTED-L4 PREMISES\n1. LINK 2: a\n2. LINK 3: b\n3. LINK 6: c\n4. LINK 4: d\n5. LINK 5: e\n6. LINK 6: f';
const J=(cl,ks)=>'reasoning\nKEYSTONE: '+(ks||'D6 -- STANDS')+'\nDEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1\n'+cl+'\nCHALLENGE STANDING: SELF-SUPPORTED\nCHALLENGER CONCEDED LINKS: 1 -- LINK 6: CONCEDED';
const it=(cl,dr2,ks)=>K.items(J(cl,ks),dr2);const via=a=>a.map(x=>x.via+' '+x.tag).join('; ')||'quiet';
let r;
r=it('CONCEDED LINKS: 1\nPremise 6: UNEXHIBITED (no answer)',DR2);T('continuation line, [DR2] maps premise 6 to LINK 6: fires',r.length===1&&/Premise 6 = LINK 6 \(\[DR2\] list\)/.test(r[0].via),via(r));
r=it('CONCEDED LINKS: 1\nPremise 6: UNEXHIBITED (no answer)',null);T('no [DR2] list, no own label: quiet (a premise number alone is not a link)',r.length===0,via(r));
r=it('CONCEDED LINKS: 1 -- Premise 2 (LINK 6, "only channel") UNEXHIBITED',null);T('no [DR2] list, own "(LINK 6" label: fires via its own label',r.length===1&&/its own LINK label/.test(r[0].via),via(r));
r=it('CONCEDED LINKS: 1 -- Premise 3 (LINK 2) UNEXHIBITED',DR2);T('[DR2] list wins over the own label (premise 3 = LINK 6 by [DR2]): fires',r.length===1&&/\[DR2\]/.test(r[0].via),via(r));
r=it('CONCEDED LINKS: 1 -- LINK 6: UNEXHIBITED',null);T('old form "LINK 6: UNEXHIBITED": fires',r.length===1&&r[0].via==='LINK 6',via(r));
r=it('CONCEDED LINKS: 0 -- Premise 6 UNEXHIBITED was answered in [CR3]',DR2);T('count 0: quiet',r.length===0,via(r));
r=it('CONCEDED LINKS: 1 -- none CONCEDED; Premise 5 UNEXHIBITED',DR2);T('"none CONCEDED" + a premise on another link: quiet',r.length===0,via(r));
r=it('CONCEDED LINKS: 1 -- Premise 6 was conceded but answered; Premise 5 UNEXHIBITED',DR2);T('lower-case "conceded" prose is not a tag: quiet',r.length===0,via(r));
r=it('DEFENDER CONCEDED LINKS: 1 -- counted: 6 UNEXHIBITED',DR2);T('"DEFENDER CONCEDED LINKS" label, "counted: 6": fires',r.length===1,via(r));
r=it('CONCEDED LINKS: 1 -- Premise 6 VOID; Premise 5 UNEXHIBITED',DR2);T('VOID is not counted: quiet',r.length===0,via(r));
r=K.items('KEYSTONE: D6 -- STANDS\nCHALLENGER CONCEDED LINKS: 1 -- LINK 6: CONCEDED',DR2);T('only a CHALLENGER count line: quiet',r.length===0,via(r));
r=K.items('KEYSTONE: D6 -- STANDS\nCONCEDED LINKS: 0\n[CR3] CONCEDED LINKS: 1 -- LINK 6: CONCEDED',DR2);T('a quoted "[CR3] CONCEDED LINKS" line is not the count line: quiet',r.length===0,via(r));
r=it('CONCEDED LINKS: 1\nPremise 6: UNEXHIBITED',DR2,'D6 -- WITHDRAWN');T('keystone WITHDRAWN: quiet',r.length===0,via(r));
// the cure on a CHANGE TO
const p=it('CONCEDED LINKS: 1\nPremise 6: UNEXHIBITED',DR2)[0];const pi={ksc:p};
const cu=(to,ans)=>K.cure(pi,{ans:ans||'CHANGE',to}).status;
T('cure: CHANGE TO "CONCEDED LINKS: 0 -- Premise 6 spared": CURED',cu('CONCEDED LINKS: 0 -- Premise 6 spared')==='CURED');
T('cure: CHANGE TO "CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED": UNCURED',cu('CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED')==='UNCURED');
T('cure: CHANGE TO "CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED": CURED (premise 5 = LINK 5)',cu('CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED')==='CURED');
T('cure: CHANGE TO "KEYSTONE: D6 -- BROKEN": CURED',cu('KEYSTONE: D6 -- BROKEN')==='CURED');
T('cure: KEEP: UNCURED',cu('','KEEP')==='UNCURED');
fs.writeFileSync('pkgCLR/test_CLR.txt',out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n');console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
