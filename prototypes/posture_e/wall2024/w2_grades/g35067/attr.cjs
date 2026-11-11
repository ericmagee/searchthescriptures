const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=v=>{let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s'+v+'.json'));d=d.data||d;return d.workflow||d;};
const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).data.resultData.runData;const n='Judge Enforcer Build';
const split=t=>{const o={};for(const p of ('\n\n'+t).split(/(?=\n\nITEM [A-Z]+[0-9]+ \()/).slice(1)){const k=p.match(/ITEM ([A-Z]+[0-9]+) \(/)[1];o[k]=p.replace(/\n\nREPLY FORM[\s\S]*$/,'');}return o;};
(async()=>{for(const [a,b] of [[114,115],[117,118]]){const A=await run(eff(g(a),n),n,rd),B=await run(eff(g(b),n),n,rd);
 console.log('==== s'+a+' -> s'+b,'calls',A.length,B.length);
 for(const k of Object.keys(A[0])){if(['body','calls','call'].includes(k))continue;const x=JSON.stringify(A.map(j=>j[k])),y=JSON.stringify(B.map(j=>j[k]));if(x!==y)console.log('field',k,x.length,y.length,'\n A:',x.slice(0,600),'\n B:',y.slice(0,600));}
 const tA=A.map(j=>j.body.messages.map(m=>m.content).join('\n')).join('\n'),tB=B.map(j=>j.body.messages.map(m=>m.content).join('\n')).join('\n');
 const IA=split(tA),IB=split(tB);for(const k of new Set([...Object.keys(IA),...Object.keys(IB)])){if(IA[k]===IB[k])continue;const x=IA[k]||'',y=IB[k]||'';let p=0;while(x[p]===y[p])p++;console.log('ITEM',k,'\n A:',x.slice(Math.max(0,p-150),p+250),'\n B:',y.slice(Math.max(0,p-150),p+250));}
 const hA=tA.split(/\n\nITEM /)[0],hB=tB.split(/\n\nITEM /)[0];if(hA!==hB){let p=0;while(hA[p]===hB[p])p++;console.log('HEAD diff\n A:',hA.slice(p-100,p+300),'\n B:',hB.slice(p-100,p+300));}}})();
