const fs=require('fs');const blk=fs.readFileSync(__dirname+'/block.js','utf8');
function run(file,dprof,cprof){const r=JSON.parse(fs.readFileSync(file,'utf8'));
 const d={cr1:r.D1,cr2:r.D2,cr3:r.D3,cr4:r.D4,gr1:r.C1,gr2:r.C2,dr3:r.C3,dr4:r.C4};const S={defender:{profile:dprof},challenger:{profile:cprof}};const SX=[];
 new Function('d','S','SX',blk)(d,S,SX);return SX;}
const sp=process.argv[2];
console.log('32510 (oracle challenger):',JSON.stringify(run(sp+'/r32510/rounds.json','plain','oracle')));
console.log('32595 (oracle challenger):',JSON.stringify(run(sp+'/r32595/rounds.json','plain','oracle')));
console.log('32510 with no oracle seat:',JSON.stringify(run(sp+'/r32510/rounds.json','plain','plain')));
// negative control: all three present
const fake={D1:'',D2:'',D3:'',D4:'',C1:'Psalm 2:7 ... Acts 13:33 ... Heb 5:5 ... Hebrews 1:5',C2:'',C3:'',C4:''};fs.writeFileSync('/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/fake_sg.json',JSON.stringify(fake));
console.log('all three present:',JSON.stringify(run('/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/fake_sg.json','plain','oracle')));
