const {unpack,rb,load}=require('../tools/lib.cjs');const w=require('../rdf/fetchback_s251.json');
const U=unpack(w);const src=rb(U.L,U.M['Alternate Cure Normalize']);
const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});const X=load(src,$);
const RL=X.__RL||X.RL;console.log('has __RL',!!X.__RL,'cureLines',typeof X.cureLines);
const sq="RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 'Behold, a virgin shall conceive, and bear a son' | [L1] Matthew 1:23 'Behold, a virgin shall be with child, and shall bring forth a son'; the pressed witnesses Isaiah 7:16 and Isaiah 8:3 were answered in [CR4] ('Matthew 1:22-23 explicitly applies Isaiah 7:14 directly to the virginal conception of Jesus'), and that fit stands.";
const dq=sq.replace(/'Behold, a virgin shall conceive, and bear a son'/,'"Behold, a virgin shall conceive, and bear a son"').replace(/'Behold, a virgin shall be with child, and shall bring forth a son'/,'"Behold, a virgin shall be with child, and shall bring forth a son"');
const dq2=dq.replace(/\('Matthew 1:22-23[^)]*'\)/,'("Matthew 1:22-23 explicitly applies Isaiah 7:14 directly to the virginal conception of Jesus")');
for(const [n,l] of [['single',sq],['double verses',dq],['double all',dq2]]){const r=X.__RL.readLine(l);console.log(n,'form',r.form,'tried',r.tried,'restated',r.f&&r.f.restated,'err',JSON.stringify(r.err||r.why||null).slice(0,300));const o=X.cureLines(l);console.log('   restated',o.restated.length,'malformed',o.malformed.length);}
const tries=[
"RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 \"Behold, a virgin shall conceive, and bear a son\"",
"RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 \"Behold, a virgin shall conceive, and bear a son\" | [L1] Matthew 1:23 \"Behold, a virgin shall be with child\"",
"RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 'Behold, a virgin shall conceive, and bear a son'",
"RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 \"Behold, a virgin shall conceive\"; the pressed witnesses were answered in [CR4], and that fit stands.",
"RESTATED: D4: STANDS -- GROUND: [L1] Isaiah 7:14 \"Behold, a virgin shall conceive\"; answered in [CR4] (\"Matthew 1:22-23 applies it\").",
];
for(const l of tries){const r=X.__RL.readLine(l);console.log(r.form||'null',JSON.stringify(r.err||null).slice(0,200),'::',l.slice(0,110));}
const ss=X.__RL.toString?String(X.__RL.readLine):'';
console.log('---');
for(const l of ["RESTATED: D4 vs C3: STANDS -- GROUND: [L1] Isaiah 7:14 'Behold, a virgin shall conceive'","D4: STANDS -- GROUND: [L1] Isaiah 7:14 'Behold, a virgin shall conceive'"]){const r=X.__RL.readLine(l);console.log(r.form||'null',r.tried||'',JSON.stringify(r.err||r.why||null).slice(0,160),'::',l.slice(0,60));}
