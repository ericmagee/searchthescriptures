// ASK 354 replay over debate_judgments since 2026-11-14 (rows42.json). PERMISSIVE: every verse a line names is given the line's own text as its row, so every 3+ word quotation after "open" counts as standing in the verse (a superset of the real hits).
const fs=require('fs');const {unpack,rb,load}=require('../g349/tools/lib.cjs');const tu=unpack(JSON.parse(fs.readFileSync('build/target_rud.json')));
const P=load(rb(tu.L,tu.M['Panel Payloads']),n=>({all:()=>[],first:()=>({json:{}}),isExecuted:false}));const R=require('./rows42.json');
const RE=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/g;let hits=[],ud=0;
for(const x of R){const t=x.reasoning;ud+=t.split('\n').filter(l=>/^\s*(?:[-•]\s*|\d+[.)]\s*)?D\d+\s+vs\.?\s+C\d+\b[^\n]*?:\s*UNDERDETERMINED\b/i.test(l)).length;const rows=[];for(const m of t.matchAll(RE))for(let v=+m[3];v<=+(m[4]||m[3]);v++)rows.push({book:m[1],chapter:+m[2],verse:v,text:t});
 const o=P.rudLines2024(x.raw,rows);for(const i of o.items)hits.push(x.id+' '+x.seat+' '+i.kind+' '+i.pair+' "'+i.phrase+'" ('+i.ref+')');}
console.log('judgments',R.length,'UNDERDETERMINED collision lines',ud,'hits',hits.length);hits.forEach(h=>console.log(' '+h));
