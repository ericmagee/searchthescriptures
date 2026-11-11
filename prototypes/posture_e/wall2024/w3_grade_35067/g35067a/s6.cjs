const L=require('./lib.cjs');
const an=L.items('Alternate Needed?')[0];
console.log(Object.keys(an.bodies[0]));
for(const b of an.bodies){const t=JSON.stringify(L.shape(b,0,1)); console.log(t.slice(0,600));}
