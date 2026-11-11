const {r,out}=require('./x.cjs');
const show=(n)=>{const o=out(n);if(!o){console.log(n,'NONE');return;}console.log('==',n,'items',o.length);o.forEach((j,i)=>{const ks=Object.keys(j);console.log(i,ks.map(k=>{const v=j[k];const s=typeof v==='string'?v.length+'c':Array.isArray(v)?'['+v.length+']':typeof v==='object'&&v?'{'+Object.keys(v).length+'}':String(v);return k+':'+s}).join(' ').slice(0,1500));});};
for(const n of process.argv.slice(2))show(n);
