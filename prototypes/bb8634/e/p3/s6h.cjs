const fs=require('fs');
const s=fs.readFileSync('p3/new/Panel_Build.js','utf8');const head=s.slice(0,s.indexOf('\n',s.indexOf('const SLC='))+1);eval(head.replace(/^\/\/.*\n/,'').replace('const SLX=','globalThis.SLX=').replace('const SLC=','globalThis.SLC='));
const served=["S-1578","S-519","S-10","S-8","S-9","S-32"];
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
const c27=Array.from({length:27},(_,i)=>i<6?served[i]:'S-'+(2000+i));
for(const [k,r] of Object.entries(rows)){console.log(k,'DEFENDER',SLC([],[],[r.claude_r1,r.claude_r2,r.engine_r3]),'| CHALLENGER (27 served stand-in)',SLC(c27,[],[r.engine_r1,r.engine_r2,r.challenger_r3]));}
const t='As Sight 32 holds, and S-519 too; Sights 8, 9; Conclusion #7; see #12; Sight 99999 is not served. Matthew 1:16.';
console.log('constructed:',SLC(["S-32","S-519","S-8","S-9","#7","#12","S-1578"],["#12"],[t]));
console.log('empty rounds:',SLC(["S-32"],[],[null,undefined,'']));
console.log('8678 extra: (S519) alone:',SLC(["S-519"],[],['as held (S519).']));
console.log('8678 extra: noise:',SLC(["S-1","#61","#18"],[],['DG-61 and S1 build; Drift Guard #18 holds; (Sirach 2:1); Psalm 2:7']));
console.log('8678 extra: Sight #519 alone:',SLC(["S-519","#519"],[],['Sight #519']));
