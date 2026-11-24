// ASK 581 test (W1): positive forms and negative controls, with stored KJV rows (rows.json, from kjv_verses) as the live check reads them.
const fs=require('fs');const {B,A}=require(__dirname+'/mk.cjs');const rows=JSON.parse(fs.readFileSync(__dirname+'/rows.json','utf8'));let fail=0;
const H='**PRESS 1.** Against D2, the point pressed here with its verses.\n';
const v=(L,t)=>L.check(H+t,rows).items.length;// 0 = the block passes
const T=(name,t,expB,expA)=>{const b=v(B,t),a=v(A,t);const ok=(b>0)===expB&&(a>0)===expA;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+name+' -- items before '+b+', after '+a);};
// positive: flagged before, passes after
T('P1 combined [L1-L3] leading','[L1-L3] Luke 1:35: "The Holy Ghost shall come upon thee" and Acts 1:8: "after that the Holy Ghost is come upon you".',true,false);
T('P2 combined [L1-L2-L3] trailing at line end','- The verbs: "The Holy Ghost shall come upon thee" (Luke 1:35), "there came a cloud, and overshadowed them" (Luke 9:34) [L1-L2-L3].',true,false);
T('P3 trailing bold tag after the quote, reference before it','Matthew 1:16 says what it says: "Joseph the husband of Mary, of whom was born Jesus" **[L1]**. The form "was supposed" stands as in "where prayer was wont to be made" (Acts 16:13) **[L3]**.',true,false);
T('P4 two verses on one trailing [L1][L3] tag','"I will be his father, and he shall be my son" (2 Samuel 7:14) is said of the seed that "shall proceed out of thy bowels" (2 Samuel 7:12) **[L1][L3]**.',true,false);
T('P5 lead-in tag over a numbered list','**[L1]** The order runs in two steps:\n1. Matthew 1:18: "before they came together, she was found with child of the Holy Ghost."\n2. Matthew 1:24: Joseph "took unto him his wife."',true,false);
T('P6 lead-in "[L2] and [L3]" over a bullet list','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n\n[L2] and [L3], verb by verb:\n- Acts 1:8: "after that the Holy Ghost is come upon you"',true,false);
T('P7 short reference after the book is named','[L1] Matthew 1:22-23: "Behold, a virgin shall be with child"\n[L3] On Genesis 24: I grant that Genesis 24:43 uses the word of the virgin whom 24:16 shows to be Rebekah, "a virgin, neither had any man known her".',true,false);
// negative controls: flagged before and after
T('N1 trailing tag after a quote with no reference in its sentence','The Spirit came "upon thee with power" **[L1]**. And Acts 1:8: "after that the Holy Ghost is come upon you" [L3].',true,true);
T('N2 combined [L2-L4] is not a verse tag','[L2-L4] Luke 1:35: "The Holy Ghost shall come upon thee" and Acts 1:8: "after that the Holy Ghost is come upon you".',true,true);
T('N3 bare chapter:verse with no book before it on the line','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] the verse 24:16 reads "a virgin, neither had any man known her".',true,true);
T('N4 numbered list under a tagged line that is not a lead-in','**[L1]** The order is plain.\n1. Matthew 1:18: "before they came together, she was found with child of the Holy Ghost."\n2. Matthew 1:24: Joseph "took unto him his wife."',true,true);
T('N5 the reference stands in the previous sentence','Read Luke 1:35. "The Holy Ghost shall come upon thee" **[L1]**. Also "after that the Holy Ghost is come upon you" [L3].',true,true);
T('N6 prose mention of tags is not a tag','- Luke 1:35 "The Holy Ghost shall come upon thee" carries no [L1], [L2] or [L3] row, and Acts 1:8 "after that the Holy Ghost is come upon you" is not [L3].',true,true);
T('N7 an [L4] line with a trailing tag adds nothing','[L4] Luke 1:35 "The Holy Ghost shall come upon thee" and Acts 1:8 "after that the Holy Ghost is come upon you" [L1].',true,true);
T('N8 a trailing tag whose quote is not in the row is not credited','"The Holy Ghost begat the child" (Luke 1:35) **[L1]**. "the power of God made him" (Acts 1:8) **[L3]**.',true,true);
T('N10 a book named without chapter:verse gives no book to a bare reference','[L1] Matthew 1:22-23: "Behold, a virgin shall be with child"\n[L3] On Genesis 24: the word is used of the virgin whom 24:16 shows to be Rebekah, "a virgin, neither had any man known her".',true,true);
T('N9 one verse only, even with a trailing tag','Matthew 1:16 says: "Joseph the husband of Mary, of whom was born Jesus" **[L1]**.',true,true);
T('N11 a time after a full reference is no verse (W3 plant D)','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] Luke 1:35 was read at 10:30 "in the morning service of the church".',true,true);
T('N12 a ratio after a full reference is no verse (W3 plant F)','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] Luke 1:35 outweighs the rest 3:1, "in the morning service of the church".',true,true);
T('N13 a bare C:V of another book is not given the named book (W3 plant B)','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] Luke 1:35 again, and at 1:8 "after that the Holy Ghost is come upon you".',true,true);
{const t=H+'[L1] Matthew 1:22-23: "Behold, a virgin shall be with child"\n[L3] I grant that Genesis 24:43 uses the word of the virgin whom 24:16 shows to be Rebekah, "a virgin, neither had any man known her".';const r=[{book:'Matthew',chapter:1,verse:22,text:rows.find(x=>x.book==='Matthew'&&x.verse===22).text},{book:'Matthew',chapter:1,verse:23,text:rows.find(x=>x.book==='Matthew'&&x.verse===23).text},{book:'Genesis',chapter:24,verse:43,text:rows.find(x=>x.book==='Genesis'&&x.verse===43).text}];const b=B.check(t,r).items.length,a=A.check(t,r).items.length;const ok=b>0&&a>0;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+'N14 the P7 form when the row of Genesis 24:16 is not held: no book is given, the block stays flagged -- items before '+b+', after '+a);}
// unchanged forms: pass before and after
T('U1 well-formed tag-first lines','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] Acts 1:8: "after that the Holy Ghost is come upon you"',false,false);
T('U2 bullets under a tag line (inherit as before)','[L1] Luke 1:35: "The Holy Ghost shall come upon thee"\n[L3] The verb elsewhere:\n- Acts 1:8: "after that the Holy Ghost is come upon you"',false,false);
// the 50-round replay totals are in replay581.cjs; the 562 interaction in replay581_562.cjs
console.log(fail?'FAIL '+fail:'ALL PASS');
