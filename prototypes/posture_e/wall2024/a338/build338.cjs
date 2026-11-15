// ASK 338 build on live s227: Citation Scan (list sites), Quote Compare (per-part book; a missing list member is CITED VERSE DOES NOT EXIST), Quote Report (per-part book in range).
const fs=require('fs');const IN=process.argv[2]||'../rdf/fetchback_s227_342.json',OUT=process.argv[3]||'target_338.json';
const d=JSON.parse(fs.readFileSync(IN));const SITE=fs.readFileSync(__dirname+'/site338.js','utf8').trim();
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const N=n=>d.nodes.find(x=>x.name===n);
{const n=N('Citation Scan');let s=n.parameters.jsCode;
 s=once(s,'for(const R of [rq,rqL,rqP,rqB,rqBP]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;',SITE+'\n for(const R of [rq,rqL,rqP,rqB,rqBP]){R.lastIndex=0;\n while((m=R.exec(t))!==null){if(spans.has(m.index))continue;if(__S338.has(m.index)){__p338(__S338.get(m.index).S);continue;}','CS loop');
 s=once(s,'opp_short:OPPS(ri,m[1]),...LB(t,round,m.index+1)});}}}','opp_short:OPPS(ri,m[1]),...LB(t,round,m.index+1)});}}\n for(const E of __S338.values())__p338(E.S);}','CS end');
 s=once(s,'items3.forEach(i=>(i.parts||[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).forEach(p=>vadd(i.book,p.chapter,p.v1,p.v2)))','items3.forEach(i=>(i.parts||[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).forEach(p=>vadd(p.book||i.book,p.chapter,p.v1,p.v2)))','CS vadd');
 s=once(s,"(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))","(i.parts||[{chapter:i.chapter}]).every(p=>readK.has((p.book||i.book)+'|'+p.chapter))",'CS readK');
 n.parameters.jsCode=s;}
{const n=N('Quote Compare');let s=n.parameters.jsCode;
 s=once(s,"const parts=[];for(const pt of PARTS(i))for(let v=pt.v1;v<=pt.v2;v++){const t=idx[i.book+'|'+pt.chapter+'|'+v];if(t)parts.push(t);}",
 "if(i.list338==='L'){const miss=PARTS(i).find(pt=>{for(let v=pt.v1;v<=pt.v2;v++)if(idx[(pt.book||i.book)+'|'+pt.chapter+'|'+v])return false;return true;});if(miss)return {...i,ref:(miss.book||i.book)+' '+miss.chapter+':'+miss.v1+(miss.v2>miss.v1?'-'+miss.v2:''),book:miss.book||i.book,chapter:miss.chapter,v1:miss.v1,v2:miss.v2,q:[],cited:'',score:0,status:'PENDING'};}/* ASK 338: a list member that does not exist still reports CITED VERSE DOES NOT EXIST */\n const parts=[];for(const pt of PARTS(i))for(let v=pt.v1;v<=pt.v2;v++){const t=idx[(pt.book||i.book)+'|'+pt.chapter+'|'+v];if(t)parts.push(t);}",'QC parts');
 n.parameters.jsCode=s;}
{const n=N('Quote Report');let s=n.parameters.jsCode;
 s=once(s,"const inRange=best&&best.book===i.book&&(Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).some(p=>+best.chapter===+p.chapter&&+best.verse>=+p.v1&&+best.verse<=+p.v2);",
 "const inRange=best&&(Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).some(p=>best.book===(p.book||i.book)&&+best.chapter===+p.chapter&&+best.verse>=+p.v1&&+best.verse<=+p.v2);",'QR inRange');
 n.parameters.jsCode=s;}
const acorn=require('../tools/node_modules/acorn');for(const nm of ['Citation Scan','Quote Compare','Quote Report'])acorn.parse(N(nm).parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('ok');
