const {unpack,rb}=require(process.env.TOOLS+'/lib.cjs');const w=require(process.argv[2]);const d=w.data||w;const u=unpack(d);
const src=x=>{const c=(x.parameters&&x.parameters.jsCode)||'';return u.M[x.name]?rb(u.L,u.M[x.name]):c;};
let n=0;for(const x of d.nodes){if(/deepseek/i.test(x.name))n++;const s=src(x);s.split('\n').forEach((l,i)=>{if(/need\('deepseek'\)|DEEPSEEK|\bds\b[^a-z]|\.deepseek\b/.test(l))console.log(x.name,'|',i+1,'|',l.trim().slice(0,220))});}
console.log('names with deepseek',n);
