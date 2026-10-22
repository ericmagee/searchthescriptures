const fs=require("fs");
const s=fs.readFileSync("prototypes/debate_fixed/build_a3/new/Panel_Payloads.js","utf8");
const i=s.indexOf("const countedSet=");const e=s.indexOf("return {P,K};};",i)+15;
const cs=new Function(s.slice(i,e)+";return countedSet;")();
const cnt=l=>{const {P,K}=cs(l);return new Set([...P,...K]).size;};
const O=JSON.parse(fs.readFileSync("regress_out.json","utf8"));
// global no-footing ablation
const T1=l=>l.replace(/\(no footing offered/gi,"(footing absent").replace(/\(no admissible footing/gi,"(admissible footing absent");
const withTag=O.filter(o=>/no footing offered|no admissible footing/i.test(o.line));
const changed=O.filter(o=>cnt(T1(o.line))!==o.counted);
console.log("lines with tag:",withTag.length,"by cls:",JSON.stringify(withTag.reduce((a,o)=>(a[o.cls]=(a[o.cls]||0)+1,a),{})),"lines whose count changes when 'no' removed from tag:",changed.length);
// counterfactual: gemini:59862684 with bare numbers relabelled premise n
const g=O.find(o=>o.who==="j:gemini:59862684");const rl=g.line.replace(/(^|, |-- )(\d): /g,"$1premise $2: ");
console.log("relabelled gemini:59862684 ->",cnt(rl),"| with tag de-negated ->",cnt(T1(rl)),"| text:",rl.slice(0,140));
const A="A bare count, no itemization",B1="items labelled Cn/Dn/Pn, not 'premise n'/'LINK n'",B2="items labelled bare 'n:' / '(n)' / 'prem n' / prose ('all four')",C="'LINK none' item carries no number",D="word 'none' in label 'LINK none' read as negation of the item's CONCEDED (premise n present)",E="negation word (not/no/never) inside the item's own description or quote negates its tag",G1="Oxford-comma list ', and 6' truncated at 5",G2="semicolon inside item parenthetical splits item from its tag",H="dual numbering 'premise n / LINK m': P∪K counts distinct numbers (n and m) not items",I="sentence boundary missed: period inside closing quote (.” / .') so following SPARED items join the CONCEDED clause";
const M={0:[B1],2:[B1],4:[D],5:[D],6:[B1],7:[B1],8:[B1],10:[B1],12:[B1],14:[B1],17:[B1],18:[B1],19:[C],22:[B1],24:[B1],25:[B1],27:[B1],29:[B1],33:[E],34:[E],36:[A],38:[C],40:[B1],42:[B2],43:[E],48:[D],49:[B2],58:[B1],59:[B1],62:[B1],65:[B2],71:[C],72:[E],73:[E],79:[B1],85:[E],86:[E],93:[C],97:[G1],98:[E],102:[A],103:[A],115:[C],116:[B2],121:[C],122:[A],123:[A],129:[A],132:[C],133:[B1],134:[B1],144:[E],149:[E],156:[C],159:[B1],160:[B1],161:[B1,E],167:[B1],171:[B1],173:[B1],174:[B1],175:[B2],177:[B1],178:[C],185:[B1],186:[B1],191:[E],195:[B1],197:[B1,E],200:[E],205:[E],207:[C],209:[B2],210:[B2],213:[C],215:[D],216:[B1],217:[B1],218:[B1],219:[B1,C],220:[B1],221:[B1],225:[B1],226:[E],227:[E],229:[D],233:[B1],237:[A],238:[A],239:[B1,E],247:[B1],251:[C],254:[E],258:[B1],265:[C],266:[B1],267:[B1,E],269:[B2],270:[B2],271:[B1],280:[B1],282:[G2],284:[B1],
1:[H],11:[I],13:[H],35:[H],50:[H],63:[H],69:[H],75:[H],76:[I],82:[H],83:[H],99:[H],119:[H],128:[H],140:[H],145:[H],152:[H],180:[H],183:[H],189:[H],192:[H],193:[H],206:[H],208:[I],212:[I],234:[I],249:[H],253:[H],257:[H],261:[H],275:[H],276:[H],281:[H]};
let miss=0;O.forEach((o,k)=>{if(o.cls!=="MATCH"&&!M[k]){miss++;console.log("UNCLASSIFIED",k);}if(o.cls==="MATCH"&&M[k])console.log("MATCH but mapped",k);o.idx=k;o.causes=M[k]||[];});
console.log("unclassified",miss);
// H check: |P| or |K| equals stated
for(const [k,v] of Object.entries(M))if(v[0]===H){const o=O[k];if(!(o.nP===o.stated||o.nK===o.stated))console.log("H check fail",k,o.nP,o.nK,o.stated);}
const grp={};O.forEach(o=>{if(o.cls==="MATCH")return;const key=o.cls+" | "+o.causes.join(" + ");grp[key]=(grp[key]||0)+1;});
Object.entries(grp).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(v,k));
const tot={};O.forEach(o=>tot[o.cls]=(tot[o.cls]||0)+1);
fs.writeFileSync("regress_out.json",JSON.stringify({totals:{lines:O.length,...tot},noFootingAblation:{linesWithTag:withTag.length,countChangedWhenNoRemoved:changed.length},rows:O},null,1));
console.log(tot);
