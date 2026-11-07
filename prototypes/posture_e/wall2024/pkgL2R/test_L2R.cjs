// pkgL2R test. Run from wall2024/ after build_L2R.cjs: node pkgL2R/test_L2R.cjs
// Data: run 33175's 8 stored rounds (debate_results ODV1-33175-bpq2xrl0) and the original_words and lexicon_words rows of every verse their
// [L2] blocks cite (data/, read by SQL 2026-11-06). The live library reproduces the stored AUDIT v28 line (112; 108; 4; 0) first.
const fs=require('fs');const {load,stmt}=require('./lib.cjs');
const OLD=load(fs.readFileSync('pkgL2R/base/Citation_Scan.js','utf8')).L2C,NEW=load(fs.readFileSync('pkgL2R/patched/Citation_Scan.js','utf8')).L2C;
const R=require('./data/rounds_33175.json'),D=require('./data/words_33175.json');let ok=0;
const t=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1;}else{ok++;console.log('OK  ',m);}};
const RA=Object.entries(R).map(([k,v])=>[k[0]==='C'?'DEFENDER':'CHALLENGER',k,v]);const read=[...new Set(D.ow.map(r=>r.book+' '+r.chapter+':'+r.verse))];
const run=L=>L.check(L.tags(RA),D.ow,D.lex,read);const A=run(OLD),B=run(NEW);
const cnt=X=>['COUNTED','NOT COUNTED','UNVERIFIABLE'].map(s=>X.filter(x=>x.status===s).length).join('/');
t(A.length===112&&cnt(A)==='108/4/0','live library reproduces the stored 33175 line: 112 tags, 108/4/0 ('+cnt(A)+')');
t(A.filter(x=>x.status==='NOT COUNTED').map(x=>x.round+' '+x.words.map(w=>w.w).join('/')).join(', ')==='CR1 G2983/Lambanō, CR1 G3933/parthenos, DR1 G3543/enomizeto/nomos, CR4 G3962/Patēr','the same 4 refusals as stored');
t(B.length===112&&cnt(B)==='109/3/0','patched: 109/3/0 ('+cnt(B)+')');
const diff=A.map((x,i)=>[x,B[i]]).filter(([x,y])=>x.status!==y.status||x.why!==y.why);
t(diff.length===1&&diff[0][0].round==='DR1'&&diff[0][1].status==='COUNTED','exactly one of 112 tags changes: DR1 enomizeto, NOT COUNTED -> COUNTED');
const dr1=diff[0][1];t(dr1.words.find(w=>w.w==='nomos').root===true&&dr1.words.find(w=>w.w==='G3543').in==='Acts 16:13, Luke 3:23','DR1: nomos marked root; G3543 found in Acts 16:13 and Luke 3:23');
t(A.every((x,i)=>JSON.stringify(x.verses)===JSON.stringify(B[i].verses)),'no tag is bound to different verses');
const pr=B.find(x=>x.round==='CR1'&&x.words.some(w=>w.w==='G3933')&&!x.verses.includes('Luke 1:27'));t(pr.status==='NOT COUNTED'&&pr.verses.join()==='Matthew 1:18,Luke 1:35,Galatians 4:4,Matthew 1:25','CR1 parthenos (premise 6) stays refused: bound to Matthew 1:18, Luke 1:35, Galatians 4:4, Matthew 1:25, none with G3933');
t(!D.ow.some(r=>r.strongs_number==='G3933'&&pr.verses.includes(r.book+' '+r.chapter+':'+r.verse)),'map check: no row of those 4 verses carries G3933 (a true refusal)');
const s2=B.find(x=>x.round==='CR1'&&x.words.some(w=>w.w==='parthenos')&&x.verses.includes('Luke 1:27'));t(s2&&s2.status==='COUNTED','CR1 section 2 parthenos (block Luke 1:27, 1:34) was and is COUNTED: the multi-verse block is read against each of its verses');
// units: small texts on the same rows
const one=(L,txt)=>L.check(L.tags([['X','U',txt]]),D.ow,D.lex,read)[0];
const u1='**[L1]** Luke 3:23: "being (as was supposed) the son of Joseph."\n**[L2]** *enomizeto* (G3543) and *nomos* (G3551), law.';
t(one(NEW,u1).status==='NOT COUNTED','a word named as the verse\'s own (not "from") still refuses: nomos without "from"');
const u2='**[L1]** Luke 3:23: "being (as was supposed) the son of Joseph."\n**[L2]** *enomizeto* (G3543), from *nomos* (G3551), law.';
const r2=one(NEW,u2);t(r2.status==='COUNTED'&&r2.words.filter(w=>w.root).map(w=>w.w).sort().join()==='G3551,nomos','"from *nomos* (G3551)": both the root word and its number are roots');
const u3='**[L1]** Luke 3:23: "being (as was supposed) the son of Joseph."\n**[L2]** from *nomos* (G3551), law.';
t(one(NEW,u3).status==='NOT COUNTED'&&one(OLD,u3).status==='NOT COUNTED','a tag of roots only is read as before (refused)');
const u4='**[L1]** Luke 3:23: "being (as was supposed) the son of Joseph."\n**[L2]** *lambano* (G2983), from *nomos*.';
t(one(NEW,u4).status==='NOT COUNTED','a false main word is still refused when a root is excused');
// the AUDIT v28 line (Build Save Body), on the patched results
const bsb=fs.readFileSync('pkgL2R/patched/Build_Save_Body.js','utf8');const L2RV=stmt(bsb,'const __L2RV=(()=>{');
const line=new Function('$','return '+L2RV.replace(/^const __L2RV=/,'')+';')(()=>({first:()=>({json:{l2:{tags:B,counts:[]}}})}))[0];
console.log('     '+line);
t(/^\[AUDIT v28: \[L2\] CHECK -- 112 tags; 109 COUNTED; 3 NOT COUNTED; 0 UNVERIFIABLE: /.test(line),'AUDIT v28 line counts');
t(line.includes('CR1 G3933/parthenos (bound to Matthew 1:18, Luke 1:35, Galatians 4:4, Matthew 1:25; map: G3933 in none of them; parthenos in none of them)'),'each refusal row names the tag, the verses it was bound to, and the map verdict per word');
// every patched node: one identical L2C; it compiles (build) and the judge path (K-L2) reads the same library
const plan=JSON.parse(fs.readFileSync('pkgL2R/plan_L2R.json','utf8'));
t(plan.nodes.length===56&&plan.nodes.filter(p=>p.l2c_final).every(p=>p.l2c_final===plan.l2c.split('>')[1]),'56 nodes: 55 L2C copies all identical after the edit, plus Build Save Body');
const sb=load(fs.readFileSync('pkgL2R/patched/Send_Back_Build.js','utf8')).L2C;const jl='D5 vs C5 (Luke 3:23): CHALLENGER LINK BROKEN -- GROUND: [L1] Luke 3:23 "being (as was supposed) the son of Joseph" | [L2] *enomizeto* (G3543), from *nomos* | [L3] Luke 2:49';
t(sb.check(sb.tags([['JUDGE','J',jl]]),D.ow,D.lex)[0].status==='COUNTED'&&OLD.check(OLD.tags([['JUDGE','J',jl]]),D.ow,D.lex)[0].status==='NOT COUNTED','judge side (Send Back Build): the same root rule, side-neutral');
console.log(ok+' OK');
