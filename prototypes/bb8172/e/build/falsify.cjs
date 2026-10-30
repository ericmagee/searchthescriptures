// BB-8172 step 1 falsifiers, DoD 1 and 2, run on new/Panel_Payloads.js (the harness shows all 17 nodes give one mark set).
const fs=require('fs'),path=require('path');
function load(file){const t=fs.readFileSync(file,'utf8');const a=t.indexOf('const DRV_REF=');const f=t.indexOf('function drvCheck(');const e=t.indexOf(' return {items,marks};}',f);
 return new Function(t.slice(a,e+' return {items,marks};}'.length)+'\nreturn {drvCheck,drvUnans:typeof drvUnans==="function"?drvUnans:null};')();}
const node=process.argv[2]||'Panel_Payloads.js';const N=load(path.join(__dirname,'new',node)),B=load(path.join(__dirname,'base',node));
const D=path.join(__dirname,'..','data');const rows={};
for(const f of fs.readdirSync(D).filter(x=>/^part_.*\.jsonl$/.test(x)))for(const l of fs.readFileSync(path.join(D,f),'utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);(rows[r.i]=rows[r.i]||[]).push(r);}
const sidOf=t=>{const u=t.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+(?:\s+VS\.?\s+C\d+)?)/);return m?m[1].replace(/\s+VS\.?\s+/,' vs '):null;};
const ku=[],ks2=[];
for(const i of Object.keys(rows).map(Number).sort((a,b)=>a-b))for(const r of rows[i]){const o=N.drvCheck(r.t,null,null,null,null,false);
 for(const m of o.marks){if(m.includes('(K-U)'))ku.push(i+' '+sidOf(r.t));if(m.includes('(K-S2)'))ks2.push(i+' '+sidOf(r.t));}}
const MARK=['774 D3 vs C4','795 D1 vs C5','797 D1 vs C4','803 D1','817 D6 vs C4','821 D4','830 D2 vs C2'];
const NOMARK=['650 D5 vs C3','659 D6 vs C1','665 D6 vs C2','692 D2 vs C2','698 D1 vs C1','725 D4 vs C5','728 D5 vs C2','728 D1 vs C5','747 D1','779 D6 vs C5','781 D6 vs C3','815 D6 vs C2','819 D6 vs C5','825 D6 vs C1'];
const REPORT=['768 D1','768 D6 vs C5'];
const res={rowsLoaded:Object.keys(rows).length,
 DoD1_missed:MARK.filter(x=>!ku.includes(x)),DoD1_falseMarks:NOMARK.filter(x=>ku.includes(x)),
 DoD1_reported:REPORT.map(x=>x+': '+(ku.includes(x)?'MARKED':'not marked')),
 KU_all:ku,KU_outside_23:ku.filter(x=>!MARK.includes(x)&&!NOMARK.includes(x)&&!REPORT.includes(x)),
 DoD2_830D1:ks2.includes('830 D1'),KS2_count:ks2.length,KS2_rows:new Set(ks2.map(x=>x.split(' ')[0])).size};
// DoD 2 built bare line: stating clause beside a bare CR3, no bracketed round.
const bare='D2 vs C3 (Matthew 1:20): UNDERDETERMINED -- the witness was answered in CR3, and Matthew 1:20 does not state that the Holy Ghost begat.';
const ob=N.drvCheck(bare,null,null,null,null,false),bb=B.drvCheck(bare,null,null,null,null,false);
res.DoD2_bare={new_KS2:ob.marks.some(m=>m.includes('(K-S2)')),new_items:ob.items.map(x=>x.rule),base_items:bb.items.map(x=>x.rule),itemsEqual:JSON.stringify(ob.items)===JSON.stringify(bb.items)};
// negative control: same line with a bracketed round inside a word must not read as bare (e.g. "[CR3]" only)
const br='D2 vs C3 (Matthew 1:20): UNDERDETERMINED -- the witness was answered in [CR3].';
res.control_no_state_no_mark=N.drvCheck(br,null,null,null,null,false).marks.length===0;
console.log(JSON.stringify(res,null,1));
