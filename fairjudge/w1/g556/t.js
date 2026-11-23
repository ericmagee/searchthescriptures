const fs=require('fs');const line=fs.readFileSync(__dirname+'/line.js','utf8');
const R=require('/mnt/project-files/ask557/w4/build/rounds41822.json');
const run=d=>{const FF=[];new Function('d','FF',line)(d,FF);return FF;};
console.log(run({gr1:R.DR1,gr2:R.DR2,dr3:R.DR3,dr4:R.DR4,cr4:R.CR4}));
console.log('no close:',run({gr1:R.DR1,gr2:R.DR2,dr3:R.DR3,dr4:R.DR4}));
console.log('bold ANSWER variant:',run({gr2:'PRESSED WITH:\nLuke 1:35 "x"\n',cr4:'**ANSWER:** Luke 1:35 -- D2 -- "x"\n'}));
console.log('ANSWER bold ref:',run({gr2:'PRESSED WITH:\nLuke 1:35 "x"\n',cr4:'ANSWER: **Luke 1:35** -- D2\n'}));
console.log('bold pressed ref:',run({gr2:'PRESSED WITH:\n**Luke 1:35** "x"\n- Luke 1:34 "y"\n1. Luke 1:32 "z"\n',cr4:'ANSWER: Luke 1:35 -- D2\n'}));
console.log('same-line press:',run({gr2:'PRESSED WITH: Luke 1:35 "x"\n',cr4:'none'}));
