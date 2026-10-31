const fs=require('fs');
const s=fs.readFileSync(process.argv[2],'utf8');const head=s.slice(0,s.indexOf('\n',s.indexOf('const SLC='))+1);
eval(head.replace(/^\/\/.*\n/,'').replace('const SLX=','globalThis.SLX=').replace('const SLC=','globalThis.SLC='));
// specimen forms copied from the stored round of 2026-10-27 08:56:23 CDT (debate_results), and the forms in 1933 P4
const t='as held in Sight #519 (S519). ... as established in Sight #2 (S2). ... as held by Drift Guard #18 (DG-18). ... as established in Drift Guard #8 (DG-8). ... as held in Sight #1583 (S1583). ... as noted in Sight #32 (S32).';
const served=['S-519','S-2','S-32','S-1583','#7'];
console.log('specimen, served S-519 S-2 S-32 S-1583 #7:', SLC(served,[],[t]));
console.log('expected: 4 of 5 (S-519, S-2, S-32, S-1583); unserved labels cited: none');
console.log('plain forms:', SLC(served,[],['Sight 519; S-2; Sights 32 and 1583; Conclusion #7']));
