// pairs from two fetches of one workflow: each changed library line becomes {old: whole old line, new: whole new line}
const fs=require('fs'),path=require('path');const T=require(path.join(__dirname,'../tools/lib.cjs'));const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const A=T.unpack(ld(process.argv[2])).L,B=T.unpack(ld(process.argv[3])).L;if(A.length!==B.length)throw new Error('line count');const P=[];A.forEach((l,i)=>{if(l!==B[i])P.push({old:l,new:B[i]});});fs.writeFileSync(process.argv[4],JSON.stringify(P));console.log('pairs',P.length);
