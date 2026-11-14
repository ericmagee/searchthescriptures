// W1 AAR 37113 aid: pkgORD sentence split also after a closing quote/bracket. Run from wall2024/pkgORD.
let ord=require('fs').readFileSync(__dirname+'/../pkgORD/ord.js','utf8');const a="para.split(/(?<=[.!?])\\s+|\\n/)";if(ord.split(a).length!==2)throw 'anchor';
ord=ord.replace(a,"para.split(/(?<=[.!?][\"”'’)\\]]*)\\s+|\\n/)");const f=new Function('d','FF',ord);
const t='- **[L3]** Genesis 4:1: "And Adam knew Eve his wife; and she conceived." Here the knowing comes first and the conceiving after.\n\n**[L4]** next';
let FF=[];f({cr2:t},FF);console.log('37113 CR2 case:',FF.length?FF[0]:'none');
const P=__dirname+'/../pkgORD/';const d8=JSON.parse(require('zlib').gunzipSync(require('fs').readFileSync(P+'rounds8.json.gz'))).concat(require(P+'d37032.json'));let n=0;
for(const r of d8){const d={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};const F=[];f(d,F);if(F.length){n++;console.log(r.id.slice(0,8),(F[0].match(/\(\d+\) \[[CD]R\d\] "[^"]*"/g)||[]).join(' ; '));}}console.log('debates',n);
