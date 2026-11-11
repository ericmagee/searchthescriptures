// every Shared Library line of the joint equals s142 or exactly one of the two graded parents (EKR, SGR s142); every other node equals s142
const fs=require('fs');const ld=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));return (D.data||D).workflow||(D.data||D);};
const lib=W=>{const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const [J,B,E,S]=['parent_s142_JOINT_EKR_SGR','fetchback_live_s142','parent_s141_JOINT_EKR','parent_s142_SGR'].map(x=>ld('/mnt/project-files/wall2024/'+x+'.json'));
const [LJ,LB,LE,LS]=[J,B,E,S].map(lib);let bad=0,fromE=[],fromS=[];LJ.forEach((l,i)=>{const e=LE[i]!==LB[i],s=LS[i]!==LB[i];if(e&&s)bad++;if(l===LB[i]&&!e&&!s)return;if(e&&l===LE[i])fromE.push(i);else if(s&&l===LS[i])fromS.push(i);else bad++;});
const other=J.nodes.filter(n=>n.name!=='Shared Library'&&JSON.stringify(n.parameters)!==JSON.stringify(B.nodes.find(z=>z.name===n.name).parameters)).map(n=>n.name);
console.log('lines from EKR',fromE,'from SGR',fromS,'| lines changed by both or by neither but different',bad,'| other nodes differing from s142',other,'| connections equal',JSON.stringify(J.connections)===JSON.stringify(B.connections));
