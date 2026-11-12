// pkgGUR test: from live s156 and the package, rebuild Gate Record's source, evaluate ECL, UND and __gub, and run __gub on a gate row
// whose UNDERDETERMINED change states its open point only in the reason after "||" (haiku run 35379 S8-S11 text), plus controls.
const fs=require('fs');
const src=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));return M['Gate Record'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const mk=S=>{const s=S.indexOf('const ECL=(()=>{'),e=S.indexOf('return {rounds,undOk,cure,CURE_UND};})();',s);const g=S.indexOf('const __gub=');const ge=S.indexOf('\n',g);if(s<0||e<0||g<0)throw new Error('blocks not found');
 const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
 return new Function('$','L2C','PASS',S.slice(s,e+41)+'\n'+S.slice(g,ge)+'\nreturn {ECL,UND,__gub};')($,{tags:()=>[]},{sb_items:[{seat:'haiku',sid:'S8',rule:'E-UNG',item:'COLLISION D2 (pressed: [DR2] premise 3)'},{seat:'haiku',sid:'S12',rule:'E-HOLD',item:'UND'}]});};
const L=mk(src('/mnt/project-files/wall2024/fetchback_live_s158.json')),P=mk(src('/mnt/project-files/wall2024/parent_s158_GUR2.json'));
const VR='[AUDIT v45: E-APPLY (pkgUND) SEAT: haiku; ITEMS: S8 (counted in drv_uncured); S12 (counted in drv_uncured)]';
const LINE='D2 vs C6 (Luke 1:35): UNDERDETERMINED -- the dio kai reach to Luke 1:32 is shown by both sides, not decided -- GROUND: [L1] Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God" | [L1] Luke 1:32 "shall be called the Son of the Highest"';
const C=[
 ['open point only in the reason (haiku S8 form)',{src:'E-APPLY S8',gid:'G1',to:LINE,reason:'The "therefore" reach is argued on both sides from the same rows and the record leaves it open.',why:'the change was applied'},true],
 ['open point in the line',{src:'E-APPLY S8',gid:'G1',to:LINE+' -- the record leaves open whether the reach goes back',reason:'',why:'the change was applied'},true],
 ['open point nowhere',{src:'E-APPLY S8',gid:'G1',to:LINE,reason:'The reach is argued from the same rows.',why:'the change was applied'},false],
 ['no [L1] anywhere',{src:'E-APPLY S8',gid:'G1',to:'D2 vs C6 (Luke 1:35): UNDERDETERMINED -- not decided -- GROUND: both sides',reason:'the record leaves it open',why:'the change was applied'},false],
 ['[L1] only in the reason, open in the line',{src:'E-APPLY S8',gid:'G1',to:'D2 vs C6 (Luke 1:35): UNDERDETERMINED -- the record leaves open the reach -- GROUND: both sides read it',reason:'[L1] Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God"',why:'the change was applied'},true],
 ['E-HOLD line, open point only in the reason',{src:'E-APPLY S12',gid:'G2',to:LINE.replace('D2 vs C6','D3 vs C4'),reason:'Both readings rest on the same row and the record leaves the source open.',why:'the change was applied'},true],
 ['not counted by pkgUND (no audit line): returns true as before',{src:'E-APPLY S9',gid:'G3',to:LINE,reason:'',why:'x'},true],
];let ok=0,ch=0;for(const [n,r,exp] of C){const l=L.__gub(r,'haiku',VR,[r]),p=P.__gub(r,'haiku',VR,[r]);if(p===exp)ok++;if(l!==p)ch++;console.log((p===exp?'ok  ':'BAD ')+'live:'+l+' new:'+p+'  '+n);}
console.log('PASS '+ok+'/'+C.length+'; changed by the package: '+ch);
