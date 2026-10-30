const W=process.argv[2];const fs=require('fs');
const src=fs.readFileSync(W+'/s_net.js','utf8');const m={exports:{}};new Function('module','exports','require',src)(m,m.exports,require);
const netLines=m.exports.netLines||m.exports;
const B=[
 ['A one-verse overclaim, collision (must NOT net)','D1 vs C2 (Matthew 1:16): STANDS -- the challenger reads Matthew 1:16 as saying that Joseph begat Jesus, but the verse does not state that.'],
 ['B chain overclaim, collision (MUST net: rows read together)','D6 vs C2 (Romans 1:3): UNDERDETERMINED -- the challenger reads the seed rows as saying that Joseph begat the child, but read together they do not state that.'],
 ['C chain overclaim, reasoning (MUST net)','x'],
 ['D two named verses claimed, collision (MUST net: rows weighed as one)','D4 vs C2 (Luke 2:48): UNDERDETERMINED -- the challenger takes Luke 2:48 and John 6:42 to say that Joseph begat Jesus, but they do not state a begetting.'],
 ['E one-verse overclaim, defender, STANDS (must NOT net)','D3: STANDS -- the defender takes Isaiah 7:14 to say that the sign names Mary, and the verse does not name her.']];
B[2][1]='HELD. The challenger reads the seed rows as meaning a begetting by Joseph, but none of those rows states that Joseph begat the child.';
for(const [n,t] of B){const o=netLines((n[0]==='C'?'':'HELD. x.\nCOLLISION POINTS:\n')+t);console.log(n,'->',o.length?'NETTED '+o.map(x=>x.item).join(','):'not netted');}
// 17 nodes carry NET_CLAIM identically
const dir=W+'/d1/new';const re=/const NET_CLAIM=[^\n]*/;const set=new Set();let n=0;for(const f of fs.readdirSync(dir)){const s=fs.readFileSync(dir+'/'+f,'utf8');const mm=s.match(re);if(mm){n++;set.add(mm[0]);}}
console.log('nodes with NET_CLAIM',n,'distinct forms',set.size,'= s_net form',set.has(src.match(re)[0]));
