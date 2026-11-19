const {unpack,rb}=require(process.env.TOOLS+'/lib.cjs');for(const f of process.argv.slice(2)){const w=require(f);const d=w.data||w;const u=unpack(d);
const src=x=>{const c=(x.parameters&&x.parameters.jsCode)||JSON.stringify(x.parameters||{});return u.M[x.name]?rb(u.L,u.M[x.name]):c;};
for(const x of d.nodes){if(x.name==='Shared Library')continue;const s=src(x);s.split('\n').forEach((l,i)=>{if(/DEEPSEEK/.test(l)&&x.name!=='Assume Check Record')console.log(f.slice(-20),x.name,i+1,l.trim().slice(0,200))});}
const ns=d.nodes.filter(x=>/deepseek/i.test(x.name)).map(x=>x.name);console.log(f.slice(-20),'names',ns.length,JSON.stringify(ns));}
