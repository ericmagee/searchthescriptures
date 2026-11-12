// pkgRFX shared helpers: which nodes carry the normalizer, their round number, and the generated text.
const S=require('./rfx_src.cjs');
const START='const __RFX=(()=>{',END='return fx;})();';
const NODES={'D1 Extract':[1,1],'D2 Extract':[2,1],'D3 Extract':[3,1],'D4 Extract':[4,1],'D2B Extract':[2,1],'D3B Extract':[3,1],'D4B Extract':[4,1],
 'C1 Extract':[1,0],'C2 Extract':[2,0],'C3 Extract':[3,0],'C4 Extract':[4,0],'C4G Extract':[4,0],'C3G Extract':[3,0],'C1B Extract':[1,0],'C2B Extract':[2,0],'C3B Extract':[3,0],'C4B Extract':[4,0]};
const gen=(n,ph)=>S.HEAD+n+S.HEAD2+(ph?S.PH:'')+S.BODY;
const span=s=>{const a=s.indexOf(START);if(a<0||s.indexOf(START,a+1)>=0)throw new Error('normalizer start count');const b=s.indexOf(END,a);if(b<0)throw new Error('normalizer end');return [a,b+END.length];};
module.exports={NODES,gen,span};
