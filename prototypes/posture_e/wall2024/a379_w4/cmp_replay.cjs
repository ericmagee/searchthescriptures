const js=JSON.stringify;
const fs=require('fs');const [PX,CX,EX]=process.argv.slice(2);const P=JSON.parse(fs.readFileSync(PX));const E=JSON.parse(fs.readFileSync(EX)).data.resultData.runData;
const RDp=P.data.resultData.runData;if(!RDp['Alternate Pass Call']){console.log('no call data',Object.keys(RDp),P.dataTooLargeToDisplay);process.exit();}
const __o0=RDp['Alternate Pass Call'][0].data.main[0][0];if(!__o0){console.log('the child returned no item (its chain stopped before R2 Alternate Merge)');}const out=__o0?__o0.json:{__none:true};if(out.__none){}else if(out.error){console.log('CHILD ERROR',JSON.stringify(out.error).slice(0,500));process.exit();}
if(!out.__none){const {__a379_nodes:nodes,...R}=out;const live=E['R2 Alternate Merge'][E['R2 Alternate Merge'].length-1].data.main[0][0].json;
console.log('child R2 Alternate Merge == stored R2 Alternate Merge:',js(R)===js(live),'bytes',js(live).length);
if(js(R)!==js(live))for(const k of new Set([...Object.keys(R),...Object.keys(live)]))if(js(R[k])!==js(live[k]))console.log('  differs',k,js(R[k]).slice(0,200),'|',js(live[k]).slice(0,200));
for(const [n,v] of Object.entries(nodes)){const st=E[n]?E[n][E[n].length-1].data.main[0].map(i=>i.json):null;console.log('  node',n,'ran',v.ran,'stored ran',!!st,'equal',v.ran?js(v.items)===js(st):!st);}
}
// child run: every chain node that ran in the stored run ran in the child, and none extra
if(CX&&fs.existsSync(CX)){const C=JSON.parse(fs.readFileSync(CX));const RDc=(C.data&&C.data.resultData&&C.data.resultData.runData)||{};const chain=JSON.parse(fs.readFileSync('../a379/chain.json'));
 const ranC=chain.filter(n=>RDc[n]),ranS=chain.filter(n=>E[n]);console.log('chain nodes run: child',ranC.length,'stored',ranS.length,'only child',ranC.filter(n=>!E[n]),'only stored',ranS.filter(n=>!RDc[n]));
 let neq=0;for(const n of ranS){if(!RDc[n])continue;const a=js(RDc[n][RDc[n].length-1].data.main[0].map(i=>i.json)),b=js(E[n][E[n].length-1].data.main[0].map(i=>i.json));if(a!==b){neq++;console.log('  node output differs',n,a.length,b.length);}}console.log('chain node outputs differing:',neq);}
