// ASK 297 pkgRHD: Alternate Merge (own code, not the library) replaces the reasoning's opening verdict word when the engine recomputed the verdict. Inserted before the final "return __AMOUT;", after pkgACL v51.
const fs=require('fs');const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const N=W.nodes.filter(n=>n.name==='Alternate Merge');if(N.length!==1)throw new Error('node');let c=N[0].parameters.jsCode;const n0=c.length;if(c.includes('pkgRHD'))throw new Error('already');
const A='\nreturn __AMOUT; /* pkgACL v51 here, ASK 287 */';if(c.split(A).length!==2||!c.endsWith(A))throw new Error('anchor');
c=c.slice(0,-A.length)+'\n'+fs.readFileSync(__dirname+'/rhd.js','utf8').trim()+A;N[0].parameters.jsCode=c;fs.writeFileSync(fout,JSON.stringify(W));console.log('Alternate Merge',n0,'->',c.length);
