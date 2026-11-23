const fs=require('fs'),crypto=require('crypto');const [,,src,out]=process.argv;
const d=JSON.parse(fs.readFileSync(src,'utf8'));
const blk=fs.readFileSync(__dirname+'/ckl_block.js','utf8');const A='{const __OSW_FLOOR=40;';
const n=d.nodes.find(x=>x.name==='Close Enforcer Record');const c=n.parameters.jsCode;if(crypto.createHash('md5').update(c).digest('hex').slice(0,8)!=='ed6c406e')throw new Error('Close Enforcer Record moved from ed6c406e');if(c.split(A).length!==2)throw new Error('anchor not unique');if(c.includes('pkgCKL'))throw new Error('already patched');
n.parameters.jsCode=c.replace(A,blk+A);fs.writeFileSync(out,JSON.stringify(d));
console.log('target',crypto.createHash('md5').update(fs.readFileSync(out)).digest('hex').slice(0,8),'node code',c.length,'->',n.parameters.jsCode.length);
