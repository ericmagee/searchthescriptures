// ASK 340 plants (W1 plan340 A1-A6, B1-B5; W1 7141 e, 7149 c, 7155 c; W2 7146 c, 7150). PRE live s229, POST target.
const fs=require('fs');const R=require('./t340.cjs');const T=require('../tools/lib.cjs');
const D=JSON.parse(fs.readFileSync('../a336/r37510.json'));const r37510=Array.isArray(D)?D[0]:D;
const row=(cr1,tok)=>({run_token:tok,claude_r1:cr1});
const L1='[L1] Matthew 1:18 "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."\n';
const P={
 A1A2_37510:r37510,
 A3_ho:row(L1+'[L2] ho (G3588, the) stands in Matthew 1:18.','A3'),
 A4_synelthein:row(L1+'[L2] *synelthein* (G4905) stands in Matthew 1:18 and its *gastri* womb.','A4'),
 A5_english_only:row(L1+'[L2] *together* and *coming* in Matthew 1:18.','A5'),
 A6_nathan_kjv_and_translit:row(L1+'[L2] *gastri* and *nathan* in Matthew 1:18.','A6'),
 A6b_sun_norm:row(L1+'[L2] *gastri* and *sun* in Matthew 1:18.','A6b'),
 A7_womb_set_aside:row(L1+'[L2] *womb*/gastēr (G1064) in Matthew 1:18.','A7'),
 B1_almah_young_woman:row('[L1] Isaiah 7:14 "Behold, a virgin shall conceive"\n[L2] almah (young woman, maid) stands in Isaiah 7:14.','B1'),
 B2_almah_virgin_maid:row('[L1] Isaiah 7:14 "Behold, a virgin shall conceive"\n[L2] almah (virgin, maid) stands in Isaiah 7:14.','B2'),
 B3_betulah_H1330:row('[L1] Genesis 24:16 "And the damsel was very fair to look upon, a virgin"\n[L2] betulah (H1330, virgin) stands in Genesis 24:16.','B3'),
 B4_G4905_cohabit:row(L1+'[L2] sunerchomai (G4905, to come together, cohabit) stands in Matthew 1:18.','B4'),
 B5_two_numbers:r=>r,
 B6_translit_part:row('[L1] Isaiah 7:14 "Behold, a virgin shall conceive"\n[L2] almah (ha-almah, almah, maid) stands in Isaiah 7:14.','B6'),
 B7_G2532_cap:row(L1+'[L2] kai (G2532, even) stands in Matthew 1:18.','B7'),
 C1_no_candidate:row(L1+'[L2] *gastri* (G1064) stands in Matthew 1:18.','C1'),
};
const DB=JSON.parse(fs.readFileSync('../a329/debates.json'));const r33055=DB.find(x=>/33055/.test(x.run_token));P.B5_two_numbers=r33055;
const show=(n,b,P0,reads)=>{const E=b.e340;const ch=[];return n+' | reads '+reads+(P0[0].none?' (no candidate, no gloss: no read)':'')+(E?' | A: ok '+E.ok+', set aside ['+E.eng.join(', ')+'], kept ['+E.blocked.join(', ')+'], not KJV ['+E.not_kjv.join(', ')+'], no answer ['+E.no_answer.join(', ')+']'+(E.why?' ('+E.why+')':'')+' | B: '+(E.gloss||[]).map(g=>g.num+' "'+g.part+'" '+g.status).join('; '):'');};
const out=[];
for(const [n,r] of Object.entries(P)){const M=R.base(r);const a=R.ex(R.S.pre,R.mk(M))[0].json;const {out:b,P:P0,reads}=R.runPost(M);
 const tg=(a.tags||[]).map((x,i)=>{const y=b.tags[i];return JSON.stringify(x)===JSON.stringify(y)?null:y.round+' '+x.status+' -> '+y.status+' ('+y.words.map(w=>w.w+(w.english?'~':w.ok?'=':'!')).join(' ')+')';}).filter(Boolean);
 const b2={...b};delete b2.e340;const same=JSON.stringify(a)===JSON.stringify(b2);
 out.push(show(n,b,P0,reads)+' | tags changed: '+(tg.join('; ')||'none')+' | output apart from e340 '+(same?'IDENTICAL':'differs'));}
// failure plants: column read fails, rendering read fails
for(const [n,re] of [['F1_column_fails','lexicon_words'],['F2_rendering_fails','strongs_number=eq.H5959']]){process.env.FAIL=re;const r=n==='F1_column_fails'?r37510:P.B1_almah_young_woman;const M=R.base(r);const a=R.ex(R.S.pre,R.mk(M))[0].json;const {out:b,P:P0,reads}=R.runPost(M);delete process.env.FAIL;
 const tg=(a.tags||[]).filter((x,i)=>JSON.stringify(x)!==JSON.stringify(b.tags[i])).length;out.push(show(n,b,P0,reads)+' | tags changed vs PRE: '+tg);}
// fold (W2 7146 c)
const F=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]/g,'');
out.push('FOLD: synérchomai -> '+F('synérchomai')+' | ginṓskō -> '+F('ginṓskō')+' | ʼâb -> '+F('ʼâb')+' | -pō -> '+F('-pō'));
// judge path: the Shared Library's own check() reads e340 from L2 Count Plan
{const w=JSON.parse(fs.readFileSync(process.argv[2]||'target_340.json'));const U=T.unpack(w);const src=T.rb(U.L,U.M['Gate Record']);
 const M=R.base(r37510);const {out:b}=R.runPost(M);const mk=on=>n=>n==='L2 Count Plan'&&on?{isExecuted:true,first:()=>({json:b}),all:()=>[{json:b}]}:{isExecuted:false,first:()=>({json:{}}),all:()=>[]};
 const j=s=>{const m=T.load(src,mk(s));const tg=m.L2C.tags([['JUDGE','J','[L1] Matthew 1:18 "she was found with child"\n[L2] *womb*/gastēr (G1064) in Matthew 1:18.']]);return m.L2C.check(tg,M['L2 Words'],M['L2 Lexicon'],null).map(t=>t.status+' '+t.why).join(' | ');};
 out.push('JUDGE PATH (Gate Record library copy): with e340 -> '+j(true)+' || without L2 Count Plan -> '+j(false));}
R.save();console.log(out.join('\n'));
