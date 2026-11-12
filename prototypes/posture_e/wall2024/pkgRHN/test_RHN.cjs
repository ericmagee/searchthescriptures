const fs=require('fs');
const ld=(f,node)=>{const c=JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name===node).parameters.jsCode;const a=c.indexOf('const __RFX=(()=>{');const b=c.indexOf('})();',a)+5;return new Function('raw',c.slice(a,b)+';return {fx:__RFX,raw};');};
const base='/mnt/project-files/wall2024/fetchback_live_s156.json',neu=__dirname+'/parent_s156_RHN.json';
let ok=0,bad=0;const T=(c,m)=>{c?ok++:(bad++,console.log('FAIL',m));};
// syntax and only-change
const bw=JSON.parse(fs.readFileSync(base,'utf8')),nw=JSON.parse(fs.readFileSync(neu,'utf8'));
T(bw.nodes.length===nw.nodes.length&&JSON.stringify(bw.connections)===JSON.stringify(nw.connections),'nodes/connections');
let diff=0;for(let i=0;i<bw.nodes.length;i++){if(JSON.stringify(bw.nodes[i])!==JSON.stringify(nw.nodes[i])){diff++;try{new Function('$','$input',nw.nodes[i].parameters.jsCode);}catch(e){T(false,'syntax '+nw.nodes[i].name);}}}
T(diff===17,'17 nodes differ: '+diff);
const cases=[ // [node, raw first lines, expect heading changed?]
 ['D4 Extract',"I keep D1 through D6 as declared in my round 1, none narrowed and none conceded. The challenger's link round grants the point.\n\n## D1",false],
 ['D4 Extract',"**I keep D1 through D6 as declared in my round 1.**\n\n## D1",false],
 ['D4 Extract',"As in round 2, I keep the links.\n",false],
 ['D4 Extract',"# Defender, Round 3: Closing\n\ntext",true],
 ['D4 Extract',"DEFENDER -- ROUND 2, RESPONSE\n\ntext",true],
 ['D4 Extract',"**Round 2 (close)**\n\ntext",true],
 ['D4 Extract',"# Round 4: Close\n\ntext",false], // already right
];
for(const h of ["# Challenger, Round 3: Romans 1:3 Still Has No Source on the Defender's Case","# Round 3: Closing the Challenge","# CHALLENGER, ROUND 3: CLOSE OF CHALLENGE","# Round 3: Closing the challenge. The seed is David's according to the flesh, and Joseph is the named father.","# Challenger, Round 3 (Close): the seed of David came through the named father, Joseph","# Challenger, Round 3: Closing the challenge","# CHALLENGER, ROUND 3: CLOSE"])cases.push(['C2 Extract',h+'\n\nbody',true]);
for(const [node,raw,exp] of cases){const o=ld(base,node)(raw),n=ld(neu,node)(raw);const ch=!!n.fx.heading;
 T(ch===exp,node+' '+JSON.stringify(raw.slice(0,60))+' new='+ch+' old='+!!o.fx.heading);
 if(exp)T(n.raw===o.raw,'heading cases equal to live: '+raw.slice(0,40));
 console.log((ch===exp?'ok  ':'BAD ')+node+' old:'+!!o.fx.heading+' new:'+ch+' '+JSON.stringify(n.raw.split('\n')[0].slice(0,80)));}
console.log('PASS',ok,'FAIL',bad);
