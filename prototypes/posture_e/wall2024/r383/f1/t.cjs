const st=require(__dirname+'/../../eff/stub.cjs');const node=process.argv[3]||'Gate Build';
const mk=(f,facts)=>{const d=st(f,node);const main=d.own.filter(o=>o[0]>0).map(o=>o[0])[0];const $=nm=>nm==='Assume Check Record'?{isExecuted:true,first:()=>({json:{acx:{facts}}})}:{isExecuted:false,first:()=>({json:{}}),all:()=>[]};
 return new Function('$','$input','items',d.S.slice(0,main).join('\n')+'\nreturn {nsg:typeof nsgRefuse2024==="function"?nsgRefuse2024:null};')($,null,[]);};
const F=[{side:'DEFENDER',n:1,link:5,k:1,fact:'Mary is of the house of David',both_not_stated:true},{side:'DEFENDER',n:1,link:5,k:2,fact:'Mary is of the lineage of David',both_not_stated:true}];
const f=mk(process.argv[2],F),f0=mk(process.argv[2],[]);if(!f.nsg)throw new Error('no fn');
const OLDC="CONCEDED LINKS: 2 -- Premise 1, LINK 5: UNEXHIBITED (assumed given fact). STEP: David's seed reaches the child through Mary -- ASSUMES: Mary is of David's house and lineage. Premise 2, LINK 5: UNEXHIBITED (assumed given fact). STEP: the law reckons the child by naming.";
const C=[
['MUST S2 39423 count to 0',"CONCEDED LINKS: 0 -- Premises 1 through 6 are spared.",OLDC,1],
['MUST G3 39450 ruling SUPPORTED',"RULING -- defender premise 1 -- SUPPORTED",'RULING -- defender premise 1 -- UNEXHIBITED',1],
['MUST drop premise 1 keep 2',"CONCEDED LINKS: 1 -- Premise 2, LINK 5: UNEXHIBITED (assumed given fact).",OLDC,1],
['CTRL G4 premise 2 not BNS',"RULING -- defender premise 2 -- SUPPORTED",'RULING -- defender premise 2 -- UNEXHIBITED',0],
['CTRL drop premise 2 keep 1',"CONCEDED LINKS: 1 -- Premise 1, LINK 5: UNEXHIBITED (assumed given fact).",OLDC,0],
['CTRL raise to counted',"RULING -- defender premise 1 -- UNEXHIBITED",'RULING -- defender premise 1 -- SUPPORTED',0],
['CTRL challenger side premise 1',"CHALLENGER CONCEDED LINKS: 0 -- none.","CHALLENGER CONCEDED LINKS: 1 -- Premise 1: VOID (adds 'only').",0],
['CTRL collision line',"D5 vs C1 (Luke 1:27): STANDS -- x","D5 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- y",0],
];let bad=0;for(const [nm,to,o,want] of C){const r=f.nsg(to,o),r0=f0.nsg(to,o);const ok=(!!r)===!!want&&!r0;if(!ok)bad++;console.log(ok?'ok ':'BAD',nm,'|',r?r.slice(0,130):'null');}
console.log('bad',bad);
