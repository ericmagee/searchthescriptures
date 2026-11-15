// ASK 323 gate-part test: parse all Shared Library users; load kunxLines from the s209 Gate Build and from the built one; run W2's a2 inputs (a2_lines.json, b5_37281.txt) plus W3-form cases b, c, d on 37281 premise 5.
const fs=require('fs'),zlib=require('zlib');const RD='../gw/prototypes/posture_e/wall2024/r383';
const ld=f=>{const w=JSON.parse(fs.readFileSync(f));const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};};
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
let p=0,t=0;const ok=(nm,c)=>{t++;if(c)p++;console.log((c?'PASS ':'FAIL ')+nm);};
const NEW=ld(process.argv[2]),OLD=ld(process.argv[3]);
for(const k of Object.keys(NEW.M)){const s=rb(NEW.M[k],NEW.L);if(s===rb(OLD.M[k],OLD.L))continue;let e=null;try{new (Object.getPrototypeOf(async function(){}).constructor)('$','$input','items',s);}catch(x){e=x.message;}ok('parse '+k,!e);}
const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
const load=s=>{globalThis.__K=null;try{new Function('$','$input','items','$json','$node','$execution','$workflow','require','globalThis.__K=kunxLines;\n'+s)($,null,[],{},{},{},{},require);}catch(e){}return globalThis.__K;};
const K0=load(rb(OLD.M['Gate Build'],OLD.L)),K2=load(rb(NEW.M['Gate Build'],NEW.L));ok('kunxLines loads from both',!!K0&&!!K2);
const stub=n=>'**LINK '+n+': SUPPORTED.**\n\n- **[L1]** Luke 1:31: "thou shalt conceive in thy womb"\n- **[L3]** Luke 1:27: "espoused to a man whose name was Joseph"\n\n---\n\n';
const R37={CR3:stub(1)+stub(2)+stub(3)+stub(4)+fs.readFileSync(RD+'/w2/run37281/b5_37281.txt','utf8'),DR3:''};
const run=(K,line,R)=>K('DEFENSE STANDING: x\n'+line,R).items;
const lines=JSON.parse(fs.readFileSync(RD+'/w2/run37281/a2_lines.json','utf8'));const rounds=JSON.parse(zlib.gunzipSync(fs.readFileSync(RD+'/data/rounds8.json.gz')));
for(const x of lines){const ln=x.t.replace(/^SENDBACK:[^|]*\|\|\s*CHANGE TO:\s*/,'').split(' || ')[0];let d=rounds.find(r=>r.id===x.debate_id);const R=d?{CR3:d.engine_r3||'',DR3:d.challenger_r3||''}:(/37281/.test(x.run_token)?R37:null);if(!R){console.log('SKIP (no rounds)',x.run_token,x.seat);continue;}
 const a=run(K0,ln,R),b=run(K2,ln,R);console.log('  ',x.run_token,x.seat,'current',a.length,'new',b.length);}
const P5=lines.find(x=>/37281/.test(x.run_token));
const base='CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (';
const cb=base+'ASSUMES: Mary is of the house of David, a fact no row in the rounds gives.)';
const cc=base+'ASSUMES: Mary is of the house of David, a fact no row in the rounds gives; the block\'s [L1] Luke 1:35 "that holy thing which shall be born of thee" does not give it.)';
const cd=base+'ASSUMES: Mary is of the house of David, a fact no row in the rounds gives; the block\'s Luke 1:35 "that holy thing which shall be born of thee" does not give it.)';
for(const [nm,l] of [['case b (no quote)',cb],['case c ([L1] token inside ASSUMES)',cc],['case d (quote, no token)',cd]]){const a=run(K0,l,R37),b=run(K2,l,R37);console.log('  ',nm,'| current',a.length,JSON.stringify(a.map(i=>(i.a||'plain')+': '+String(i.why).slice(0,90))),'| new',b.length,JSON.stringify(b.map(i=>(i.a||'plain')+': '+String(i.why).slice(0,90))));
 if(/case c/.test(nm))ok('case c: the plain false flag is gone (new has no plain item)',!b.some(i=>!i.a&&/lacks \[L1\]/.test(i.why)));}
const plainLine=run(K2,base+'the block does not show its footing.)',R37);const L0=plainLine.map(i=>i.line||'').join(' ');
ok('plain-path item line offers ASSUMES route, lists 3 options, and carries 4a',/; or, if the step takes for granted a fact no row in the rounds gives, write ASSUMES: <that fact> and quote the block's \[L1\]; or write a CORRECTED COUNT/.test(L0)&&/never inside the CONCEDED LINKS line/.test(L0));
console.log('  plain item line:',L0.slice(0,700));
console.log(p+' of '+t);
