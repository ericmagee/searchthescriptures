// pkgFCB replay on the 30 stored FORCED lines since 32791 (forced_lines.json), each run's press lines (pkgMVT/means_lines.json) and the 14 KJV
// verses they press (verses_fixture.json, from kjv_verses). Run from wall2024/: node pkgFCB/replay_FCB.cjs
const fs=require('fs');const F=new Function('$',fs.readFileSync('pkgFCB/test_env.js','utf8')+fs.readFileSync('pkgFCB/kfc_lib.js','utf8')+';return {kfcLines,kfcVerse,KF_LINE,kfcText};')(()=>{throw 0;});
const FL=JSON.parse(fs.readFileSync('pkgFCB/forced_lines.json','utf8')),ML=JSON.parse(fs.readFileSync('pkgMVT/means_lines.json','utf8')),V=JSON.parse(fs.readFileSync('pkgFCB/verses_fixture.json','utf8'));
let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;}else{bad++;console.log('FAIL',n);}};const rows={};
for(const f of FL){const l=f.line.replace(/\\"/g,'"');const m=l.replace(/[*_`]+/g,'').match(F.KF_LINE);const rk=m[2].toUpperCase();const R={[rk]:ML.filter(x=>x.run===f.run).map(x=>x.line).join('\n')};
 const v=F.kfcVerse(m[3],R[rk]);const kt=F.kfcText(v,V);const w=kt.replace(/\[[^\]]*:[^\]]*\]/g,'').replace(/[\[\]]/g,'').split(/\s+/).filter(Boolean);
 const good='"'+w.slice(0,Math.min(6,w.length)).join(' ')+'"';const other=V.find(x=>x.text!==kt&&x.book!==v.book).text.split(' ').slice(2,8).join(' ');
 const ins=s=>l.includes(' -- GROUND:')?l.replace(' -- GROUND:',' -- CARRIED BY: '+s+' -- GROUND:'):l+' -- CARRIED BY: '+s;
 const a=F.kfcLines(l,R,V),b=F.kfcLines(ins(good),R,V),c=F.kfcLines(ins('"'+other+'"'),R,V),d=F.kfcLines(ins(good),R,[]);
 const tag=f.run.slice(5,10)+' '+m[1]+' ('+v.ref+')';
 t(tag+' as stored: one K-FC item, no CARRIED BY',a.items.length===1&&/no CARRIED BY/.test(a.items[0].why));
 t(tag+' with verse words '+good+': no item',b.items.length===0);
 t(tag+' with words of another verse: one item naming '+v.ref,c.items.length===1&&c.items[0].why.includes(v.ref));
 t(tag+' verse not read this run: NOT CHECKED, no item',d.items.length===0&&d.report.length===1);
 t(tag+' K-F parse unchanged by the new field',JSON.stringify(ins(good).replace(/[*_`]+/g,'').match(F.KF_LINE).slice(1,7))===JSON.stringify(m.slice(1,7)));
 rows[tag]=1;}
console.log(Object.keys(rows).length+' lines; '+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
