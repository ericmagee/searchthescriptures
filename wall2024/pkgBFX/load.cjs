const lib=require('./lib.cjs');
module.exports=(file,node)=>{let s=lib(file,node);
const names=['kunxLines','lbBlockText','ciRounds','lbFoot','unxSegs','psGrades','rctCheck','unxaCheck','ciCountSection','unxPresses'];
// cut at the first line that calls $( at column 0..2 outside function bodies: take only the hoistable library part up to the first top-level "$(" use
const lines=s.split('\n');let cut=lines.length;
for(let i=0;i<lines.length;i++){if(/^\s{0,1}(?:const|let|var)?\s*[\w$]*\s*=?\s*\$\(/.test(lines[i])||/^(?:const|let)\s+\w+\s*=\s*\$input\b/.test(lines[i])){cut=i;break;}}
const body=lines.slice(0,cut).join('\n');
const f=new Function('$','$input',body+'\n;return {'+names.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'};');
const stub=()=>{throw new Error('$ called')};
const r=f(stub,{first:stub,all:stub});r.__cut=cut;r.__n=lines.length;return r;};
