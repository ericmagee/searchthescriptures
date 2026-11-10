// W3 plant k (added after the first plant run; no label was committed for it): no line of the defender's rounds names the verse at all, and the DeepSeek reason keeps its deferral words.
const G=require('./g.cjs');const {H,J}=G;const RUN='34108';const NORM=['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];
(async()=>{const o={};for(const n of NORM){const v=J(H.out(RUN,n));if(!v)continue;const R=v.flat()[0].json.cure.rounds;for(const k of ['CR1','CR2','CR3','CR4'])if(R[k])R[k]=R[k].split('\n').filter(l=>!/Luke 1:34(?![0-9])/.test(l)).join('\n');o[n]=v;}
 const b=(await H.run(G.CAND('Send Back Build'),RUN,'Judge Enforcer Record',o)).map(x=>x.json);const w=(b[0].sb_not_sent||[]).filter(x=>/pkgEAD/.test(x.why)&&/Luke 1:34 \[CR3\]/.test(x.item));
 console.log('k. no line of [CR1] to [CR4] names Luke 1:34 | withheld for: '+(w.map(x=>x.seat).join(',')||'none')+(w[0]?'\n   written reason: '+w[0].why:''));})();
