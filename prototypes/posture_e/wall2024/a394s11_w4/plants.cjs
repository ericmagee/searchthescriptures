// ASK 394 site 11 plants (W4 8583 item 6; W2 after 8583 items 3a-3e), bnsRefuse2024 from the Gate Build stub, live 386 against t394s11.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
const load=(f,node,facts)=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);const S=T.rb(U.L,U.M[node]);const pre='(async()=>{\n';const ast=acorn.parse(pre+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;const off=-pre.length;const parts=[];
 for(const st of body){const src=S.slice(st.start+off,st.end+off);if(st.type==='FunctionDeclaration')parts.push(src);else if(st.type==='VariableDeclaration'&&(/^(const|let|var)\s+(REFP|__RL)\b/.test(src)||!/\$\(|\$input|\$json|\$node|items\b/.test(src)))parts.push('try{'+src.replace(/^(const|let)\s/,'var ')+'}catch(e){}');}
 const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:{facts}}})};throw new Error('no '+n);};
 return new Function('$',parts.join('\n')+'\nreturn {bnsRefuse2024};')($);};
const F4=[{side:'DEFENDER',link:4,n:3,fact:'Mary of the house of David',both_not_stated:true}];
const P=[['2a vs-line STANDS (row 43734 text)','D4 vs C2 (Isaiah 7:14): STANDS -- GROUND: [L1] Isaiah 7:14 "Behold, a virgin shall conceive"',F4],
 ['3a verse-less','D4 vs C2: STANDS -- x',F4],['3b bullet and bold','- **D4 vs C2 (Isaiah 7:14): STANDS** -- x',F4],['3b numbered','1. D4 vs C2 (Isaiah 7:14): STANDS',F4],
 ['3c "vs." with a period','D4 vs. C2 (Isaiah 7:14): STANDS',F4],['3c lower case','d4 vs. c2 (Isaiah 7:14): stands -- x',F4],
 ['3d trailing tag after STANDS','D4 vs C2 (Isaiah 7:14): STANDS [AUDIT v9: X; END]',F4],['3d trailing parenthesis','D4 vs C2 (Isaiah 7:14): STANDS (pkgX)',F4],
 ['2b / 3e FORCED prefix','FORCED: D4 vs C2 (Isaiah 7:14): STANDS -- x',F4],['3e FORCED with a parenthesis','FORCED (K-F): D4 vs C2 (Isaiah 7:14): STANDS',F4],
 ['2c LINK STATE "D4: STANDS" (not added)','D4: STANDS -- x',F4],['no fact on D4','D4 vs C2 (Isaiah 7:14): STANDS',[{side:'DEFENDER',link:5,n:5,fact:'x',both_not_stated:true}]],
 ['fact on the challenger side only','D4 vs C2 (Isaiah 7:14): STANDS',[{side:'CHALLENGER',link:4,n:4,fact:'x',both_not_stated:true}]],
 ['grade UNDERDETERMINED','D4 vs C2 (Isaiah 7:14): UNDERDETERMINED -- x',F4],['DEFENDER LINK STANDS','D4 vs C2 (Isaiah 7:14): DEFENDER LINK STANDS',F4],
 ['compound pair','D4 vs C4/C6 (Isaiah 7:14): STANDS',F4],['text between verse and colon','D4 vs C2 (Isaiah 7:14) as answered: STANDS',F4]];
const out=[];const stubs=['Gate Build','Alt Gate Record','Alternate Merge Seat','R2 Alternate Merge Seat','R2 Alt Late Gate Build'];
for(const [nm,t,facts] of P){const row={plant:nm,text:t};for(const s of stubs){const o=load(__dirname+'/../rdf/fetchback_w386.json',s,facts).bnsRefuse2024(t),n=load(__dirname+'/t394s11.json',s,facts).bnsRefuse2024(t);const f=x=>x?'REFUSED D'+(String(x).match(/sets D(\d+)/)||[])[1]:'not refused';row[s]={live386:f(o),t394s11:f(n)};}
 const g=row['Gate Build'];row.same_all_stubs=stubs.every(s=>row[s].live386===g.live386&&row[s].t394s11===g.t394s11);out.push(row);console.log(nm.padEnd(44),'live',g.live386.padEnd(14),'new',g.t394s11.padEnd(14),'all 5 stubs same',row.same_all_stubs);}
fs.writeFileSync(__dirname+'/plants_out.json',JSON.stringify(out,null,1));
