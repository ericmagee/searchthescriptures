// ASK 384 rev 4 fixtures with required answers (verse labels without book where one book). Exit 1 on any miss.
const R=require(process.argv[2]||'./refp_r4.cjs');const r13=(c,a,b)=>Array.from({length:b-a+1},(_,i)=>c+':'+(a+i)).join(' | ');
const F=[['Matthew 1:18, 20',12,'1:18 | 1:20'],['Matthew 1:18, 2 witnesses',12,'1:18'],['Matthew 1:18, 99',12,'1:18 | 1:99'],['Matthew 1:1-17',12,r13(1,1,13)],['Matthew 1:1-17',30,r13(1,1,17)],
['Matthew 1:18 and 20',12,'1:18 | 1:20'],['Matthew 1:18, 20, and 2 witnesses',12,'1:18 | 1:20'],['Matthew 1:18,20',12,'1:18 | 1:20'],['Matthew 1:18; 2:1',12,'1:18 | 2:1'],['Matthew 1:26',12,'1:26'],
['Matthew 1:18-20, 25',12,'1:18 | 1:19 | 1:20 | 1:25'],['Matthew 1:18, 2:1',12,'1:18 | 2:1'],['Psalms 119:1-176',12,r13(119,1,13)],['Isaiah 7:14, 3 times',12,'7:14'],['Matthew 1:18 to 1:25',12,'1:18 | 1:25'],
['as established in Matthew 1:18, 20 [L1], through gennao',12,'1:18 | 1:20'],['(Matthew 1:18, 20)',12,'1:18 | 1:20'],['Matthew 1:18, 20: the angel',12,'1:18 | 1:20'],['Jude 1:3 and Judges 1:3',12,'Jude 1:3 | Judges 1:3'],
['2 Samuel 7:12, 14',12,'7:12 | 7:14'],['Matthew 1:18, 20-23',12,'1:18 | 1:20 | 1:21 | 1:22 | 1:23'],['Matthew 1:18; 20',12,'1:18'],['Matthew 1:18 and 20 show',12,'1:18'],
['Luke 2:48, 33 and John 6:42',12,'Luke 2:48 | Luke 2:33 | John 6:42'],['Isaiah 7:14, 7 verses',12,'7:14'],['Luke 1:36, 5 makes',12,'1:36'],['Genesis 24:43, 16 pair',12,'24:43'],
['Matthew 1:18 and the scattering at 34:5-6',12,'1:18'],['Acts 17:1 is the city; at 17:11 they searched',12,'17:1 | 17:11'],
['Matthew 1:18, 40 witnesses',12,'1:18 | 1:40'],['Matthew 1:18 and then 1:26',12,'1:18'],["Isaiah's 66:30 says",12,''],['Matthew 1:20, 18 says',12,'1:20'],['Psalms 2:7, 12 Kiss the Son',12,'2:7'],
['Matthew 1:18 is the birth. The scattering at 34:5-6 follows',12,'1:18'],['the preceding verse (Micah 5:1 [4:14 MT]), where',12,'5:1']];
let bad=0;for(const [t,cap,want] of F){const o={cap,scoped:true,refused:[],cut:[]};const ks=R.keys(t,o).map(k=>k.key);const books=new Set(ks.map(k=>k.replace(/ \d+:\d+$/,'')));const got=ks.map(k=>books.size>1?k:k.replace(/^.* (\d+:\d+)$/,'$1')).join(' | ');
 const ok=got===want;if(!ok)bad++;console.log(ok?'PASS':'FAIL',JSON.stringify(t),'cap',cap,'=>',got.slice(0,140),ok?'':'| WANT '+want,o.refused.length?'refused '+JSON.stringify(o.refused):'',o.cut.length?'cut '+JSON.stringify(o.cut):'');}
console.log(F.length,'fixtures,',bad,'fail');process.exitCode=bad?1:0;
