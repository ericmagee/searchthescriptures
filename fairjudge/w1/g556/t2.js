const fs=require('fs');const R=require('/mnt/project-files/ask557/w4/build/rounds41822.json');
const mk=f=>{const line=fs.readFileSync(__dirname+'/'+f,'utf8');return d=>{const FF=[];new Function('d','FF',line)(d,FF);return FF[0]||'(none)';};};
const A=mk('line.js'),B=mk('line_c1.js');
const cases={
 r41822:{gr1:R.DR1,gr2:R.DR2,dr3:R.DR3,dr4:R.DR4,cr4:R.CR4},
 header_list:{gr2:'**PRESSED WITH:** Luke 3:23; Acts 16:13; Numbers 1:18; Luke 2:27; Luke 2:48; John 1:45\n',cr4:'ANSWER: Luke 3:23 -- D2 -- "x"'},
 header_quote:{gr2:'3. LINK 2 -- "therefore" -- PRESSED WITH: Luke 2:48: "And when they saw him, Joseph 1:1" x\n',cr4:'ANSWER: Luke 2:48 -- D2'},
 tagged_lines:{gr2:'PRESSED WITH:\n- [L1] Matthew 1:19: "Then Joseph"\n[L1] Luke 2:48: "And when"\n- [L3] Acts 2:30: "of the fruit"\n\nLuke 1:1 not pressed\n',cr4:'ANSWER: Acts 2:30 -- D1'},
 midline_text:{gr2:'2. LINK D2. text (Luke 2:41). PRESSED WITH: Luke 2:41, Luke 2:48, Acts 16:13.\n3. LINK D3. Luke 1:34 next\n',cr4:'none'},
};
for(const [k,d] of Object.entries(cases))console.log(k.padEnd(13),'| draft2:',A(d).replace('[AUDIT: CLOSE PRESS LIST (record-only) -- ',''),'\n'+' '.repeat(13),'| with C2:',B(d).replace('[AUDIT: CLOSE PRESS LIST (record-only) -- ',''));
