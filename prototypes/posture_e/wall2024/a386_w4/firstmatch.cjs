// ASK 386 condition 3g (W3 8412 item 4): stored judgments where judgment_result_word's no-tag path (first "RESULT:" match anywhere) lands inside a bracketed AUDIT tag.
const fs=require('fs');const J=JSON.parse(fs.readFileSync(__dirname+'/../a384/judgments_all.json'));
const V21=/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: (\w+); COUNTED: (\w+) \([A-Z]+-[0-9]\)(?:; RETRACTED: ([^\]]*))?\]/;
const FM=/RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/;const out=[];let notag=0,inside=0,multi=0;
for(const j of J){const t=j.v||'';const m=t.match(V21);if(m&&m[1]===j.seat&&m[2]!==m[3])continue;notag++;const f=FM.exec(t);if(!f)continue;
 const open=t.lastIndexOf('[AUDIT',f.index),close=t.lastIndexOf(']',f.index);const ins=open>=0&&open>close;
 const all=[...t.matchAll(/(?:^|\n)[ \t*_>-]*RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/g)];if(all.length>1&&new Set(all.map(a=>a[1])).size>1)multi++;
 if(ins){inside++;const tag=t.slice(open,Math.min(t.length,open+90)).replace(/\s+/g,' ');const lineStart=(all[0]||[])[1];out.push({id:j.id,seat:j.seat,first:f[1],firstLineStart:lineStart||null,tag});}}
console.log('judgments',J.length,'on the no-tag path',notag,'first match inside an AUDIT tag',inside,'| with line-start RESULT words that disagree',multi);out.forEach(o=>console.log(' ',o.id,o.seat,'first:',o.first,'| first line-start RESULT:',o.firstLineStart,'|',o.tag));
fs.writeFileSync(__dirname+'/firstmatch_out.json',JSON.stringify(out,null,1));
