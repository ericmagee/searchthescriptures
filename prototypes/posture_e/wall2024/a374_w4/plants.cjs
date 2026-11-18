// ASK 374 plants (W3 8798 B 4c, W1 8799 plant 7): bnsRefuse2024 from the Gate Build stub, live (fetchback_w409) against target.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
const load=(f,facts,node='Gate Build')=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);const S=T.rb(U.L,U.M[node]);const pre='(async()=>{\n';const ast=acorn.parse(pre+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;const off=-pre.length;const parts=[];
 for(const st of body){const src=S.slice(st.start+off,st.end+off);if(st.type==='FunctionDeclaration')parts.push(src);else if(st.type==='VariableDeclaration'&&(/^(const|let|var)\s+(REFP|__RL)\b/.test(src)||!/\$\(|\$input|\$json|\$node|items\b/.test(src)))parts.push('try{'+src.replace(/^(const|let)\s/,'var ')+'}catch(e){}');}
 const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:{facts}}})};if(n==='Shared Library')return {params:d.nodes.find(x=>x.name==='Shared Library').parameters};throw new Error('no '+n);};
 return new Function('$',parts.join('\n')+'\nreturn {bnsRefuse2024};')($);};
const DF={side:'DEFENDER',link:4,n:3,fact:'Mary of the house of David',both_not_stated:true};
const CF={side:'CHALLENGER',link:2,n:2,fact:'Joseph begat Jesus',both_not_stated:true};
const C7={side:'CHALLENGER',link:4,n:2,fact:'Joseph begat Jesus',both_not_stated:true};
const P=[
 ['1 DEFENDER fact, D4 vs C2: STANDS','D4 vs C2 (Isaiah 7:14): STANDS -- GROUND: x',[DF],true],
 ['2 CHALLENGER fact n2, D4 vs C2: DEFENDER LINK BROKEN','D4 vs C2 (Isaiah 7:14): DEFENDER LINK BROKEN -- GROUND: x',[CF],true],
 ['3 same fact, D4 vs C3: DEFENDER LINK BROKEN','D4 vs C3 (Isaiah 7:14): DEFENDER LINK BROKEN -- GROUND: x',[CF],false],
 ['4 CHALLENGER fact, D4 vs C2: STANDS','D4 vs C2 (Isaiah 7:14): STANDS -- GROUND: x',[CF],false],
 ['5 FORCED prefix with the fact','FORCED (D4 vs C2): D4 vs C2 (Isaiah 7:14): DEFENDER LINK BROKEN -- GROUND: x',[CF],true],
 ['6 no facts','D4 vs C2 (Isaiah 7:14): DEFENDER LINK BROKEN -- GROUND: x',[],false],
 ['7 fact n2 link4, D1 vs C2: DEFENDER LINK BROKEN','D1 vs C2 (Matthew 1:16): DEFENDER LINK BROKEN -- GROUND: x',[C7],true],
 ['extra: CHALLENGER LINK BROKEN with the fact','D4 vs C2 (Isaiah 7:14): CHALLENGER LINK BROKEN -- GROUND: x',[CF],false],
 ['extra: bullet and bold','- **D4 vs C2 (Isaiah 7:14): DEFENDER LINK BROKEN** -- x',[CF],true]];
const [OLD,NEW]=process.argv.slice(2);let ok=0;const out=[];
for(const [nm,t,F,want] of P){const o=load(OLD,F).bnsRefuse2024(t),n=load(NEW,F).bnsRefuse2024(t);const pass=(!!n)===want&&(nm.startsWith('1')?!!o===!!n:true);if(pass)ok++;out.push((pass?'PASS ':'FAIL ')+nm+' | old: '+(o?'REFUSED':'applied')+' | new: '+(n?'REFUSED: '+n:'applied'));}
console.log(out.join('\n'));console.log('plants',ok,'of',P.length);
