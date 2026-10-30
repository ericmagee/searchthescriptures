// BB-8327 DoD 2: the net over the stored texts (texts/, each md5-checked against the database) and the built specimens.
const fs=require('fs');const {netLines}=require('./s_net.js');
const rd=f=>fs.readFileSync(__dirname+'/texts/'+f,'utf8');
// The netted set agreed at BB-8337 and BB-8338 (26 lines), with 837 KEYSTONE ruled IN at BB-8349 (27), by text and K-C item.
const WANT={
 '837.txt':['REASONING','KEYSTONE','D1 vs C2','D2 vs C3','D3 vs C1','D4 vs C2','D5 vs C6','D6 vs C2'],
 '839.txt':['REASONING','D1','D5'],
 'single_29662.txt':['REASONING','D2 vs C3','D3 vs C1','D4 vs C2','D5 vs C6','D6 vs C2'],
 '834.txt':['KEYSTONE','D1 vs C4','D3 vs C1','D5 vs C4','D6 vs C4'],
 '836.txt':['CONCEDED LINKS'],
 'single_29609.txt':['REASONING','D1 vs C4','D2 vs C2','D6 vs C4']};
// Agreed NOT netted lines, by item (lines 6 and 16 of classify_19; A3's reviewed three, 8337).
const NOT={'single_29662.txt':['D1'],'836.txt':['D1','D5 vs C4'],'839.txt':['D6'],'834.txt':['D4 vs C5']};
let fail=0,n=0;const ok=(c,m)=>{n++;if(!c){fail++;console.log('FAIL',m);}};
const extra=[];let total=0;
for(const [f,want] of Object.entries(WANT)){const got=netLines(rd(f)).map(x=>x.item);total+=want.length;
 for(const w of want)ok(got.includes(w),f+' misses '+w);
 for(const g of got)if(!want.includes(g))extra.push(f+' '+g);
 for(const x of (NOT[f]||[]))ok(!got.includes(x),f+' marks '+x+' (agreed not netted)');}
console.log('netted set',total,'(want 27)');ok(total===27,'set size');
// Excluded specimens: quoted debater rows in the out-of-round block (28514 judgments 807, 808, 809; 29519 judgment 831).
const oor=s=>'HELD. The chain stands.\nCOLLISION POINTS:\nD1 vs C1 (Matthew 1:25): STANDS -- answered in [CR2].\nOUT-OF-ROUND CONCESSIONS:\n'+s+'\nDEFENDER CHAIN MARK: FOOTED -- footed.';
ok(netLines(oor('CHALLENGER | [DR2] | "The defender concedes that "till" does not state earlier intercourse, and I do not claim it does."')).length===0,'807-809 concession row marked');
ok(netLines(oor("DEFENDER | CR1 | I do not rest the case on identifying Mary's line, since the KJV does not state it.")).length===0,'831 concession row marked');
// Built specimens (1913, 1916, DoD 2).
const B=(l)=>netLines('HELD. The chain stands.\nCOLLISION POINTS:\n'+l).map(x=>x.item+'/'+x.side);
ok(B('D2: STANDS -- [CR2] answered the press; Luke 2:48, offered as itself contradicting the link, does not state the contrary in its own words.').length===0,'single pressed witness marked');
ok(B('D3 vs C2 (Luke 2:48): UNDERDETERMINED -- the one row of the link, Luke 2:48, does not state a begetting by Joseph.').join()==='D3 vs C2/CHALLENGER','single declared link (1916) not marked');
ok(B("D4 vs C3 (Luke 1:35): UNDERDETERMINED -- the defender's rows Luke 1:35 and Matthew 1:20 do not state that no man begat the child.").join()==='D4 vs C3/DEFENDER','defender-side line not marked');
// 1909 (b), A3's specimen at BB-8349 and a STANDS form: a judge answering a side's own overclaim.
ok(B('D1 vs C2 (Matthew 1:16): UNDERDETERMINED -- the challenger reads Matthew 1:16 as saying that Joseph begat Jesus, but the verse does not state that.').length===0,'1909 (b) overclaim answer marked (A3 8349)');
// A3's B, C, D (BB-8352): an overclaim about rows read together, answered by the stating test, still nets.
ok(B('D6 vs C2 (Romans 1:3): UNDERDETERMINED -- the challenger reads the seed rows as saying that Joseph begat the child, but read together they do not state that.').join()==='D6 vs C2/CHALLENGER','A3 B not netted');
ok(netLines('The challenger reads the seed rows as meaning a begetting by Joseph, but none of those rows states that Joseph begat the child.\nRESULT: UNDERDETERMINED -- open.').map(x=>x.item).join()==='REASONING','A3 C not netted');
ok(B('D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the challenger takes Luke 2:48 and John 6:42 to say that Joseph begat Jesus, but they do not state a begetting.').join()==='D4 vs C2/CHALLENGER','A3 D not netted');
ok(B('D3: STANDS -- the defender takes Isaiah 7:14 to say that the sign names Mary, and the verse does not name her; the link stands on [CR2].').length===0,'1909 (b) STANDS form marked');
ok(B('D5 vs C1 (Isaiah 7:14): UNDERDETERMINED -- [CR2] answered the sign by Matthew 1:22-23; the reading contest stays open.').length===0,'a line with no stating ground marked');
console.log('outside the agreed set, marked:',extra.length?extra.join('; '):'none');
console.log(`asserts ${n}, fail ${fail}`);process.exit(fail?1:0);
