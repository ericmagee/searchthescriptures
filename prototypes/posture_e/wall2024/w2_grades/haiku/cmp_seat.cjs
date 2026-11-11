const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const A=wf(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s116.json');
const by={};A.nodes.forEach(n=>by[n.name]=n);const c=by['Alternate Merge Seat'].parameters.jsCode;const src=c.includes('\nreturn await new Function(')?rebuild(c,by['Shared Library'].parameters.jsCode):c;
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const r=(ex.data||ex).resultData.runData;const st={};for(const [n,runs] of Object.entries(r)){const l=runs[runs.length-1];st[n]=(l&&l.data&&l.data.main)||null;}
const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
(async()=>{const o=(await H.run(src,'x34726','Alternate Calls?',mk(st)))[0].json;const s=st['Alternate Merge Seat'][0][0].json;
 for(const k of new Set([...Object.keys(o),...Object.keys(s)]))if(S(o[k])!==S(s[k]))console.log('DIFF',k,'\n  s116:',S(o[k]).slice(0,700),'\n  stored:',S(s[k]).slice(0,700));
 const log=x=>(x.enforcer_log||[]).filter(e=>e.seat==='haiku'&&e.cure_status!=='CURED').map(e=>e.rule+' '+e.item+' '+e.cure_status+' '+String(e.cure_reason).slice(0,160));
 console.log('haiku uncured s116:',log(o).length,'\n ',log(o).join('\n  '));console.log('haiku uncured stored:',log(s).length,'\n ',log(s).join('\n  '));})();
