// BB-8650 DoD 2(b) list-obedience script, as stated: refs 'Book c:v' (range by first verse) in a side's three rounds, absent from that side's own list text (after its UNSUPPORTED-L4 heading)
const fs=require('fs');
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
const BOOK='(?:[123] )?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)';
const RE=new RegExp('\\b('+BOOK+') (\\d+):(\\d+)','g');
const refs=t=>{const s=new Set();for(const m of String(t||'').matchAll(RE))s.add(m[1].replace(/^Psalm$/,'Psalms')+' '+m[2]+':'+m[3]);return s;};
const H=/UNSUPPORTED-L4 PREMISES/i;
const listText=rs=>{for(const t of rs){const i=String(t||'').search(H);if(i>=0)return t.slice(i);}return '';};
for(const [rk,r] of Object.entries(rows)){
 const sides={defender:[r.claude_r1,r.claude_r2,r.engine_r3],challenger:[r.engine_r1,r.engine_r2,r.challenger_r3]};
 for(const [sd,rs] of Object.entries(sides)){const all=new Set();rs.forEach(t=>refs(t).forEach(x=>all.add(x)));const lt=listText(rs);const L=refs(lt);
  const miss=[...all].filter(x=>!L.has(x));console.log(rk,sd,'refs',all.size,'listText',lt.length,'absent',miss.length, miss.join(', '));}}
