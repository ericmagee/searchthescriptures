const SLX=(rounds)=>{const t=rounds.map(x=>String(x||'')).join('\n');const c=new Set();for(const m of t.matchAll(/(?:\bS-|\bSights?\s+#?)(\d+)(?!\d)/g))c.add('S-'+m[1]);for(const m of t.matchAll(/(?<!\b(?:Sights?|Guard)\s*)(?:#|\bConclusion\s+#?)(\d+)(?!\d)/g))c.add('#'+m[1]);return c;};
const SLC=(served,named,rounds)=>{const L=Array.isArray(served)?served:[];const c=SLX(rounds);const ok=new Set([...L,...(Array.isArray(named)?named:[])]);const hit=L.filter(l=>c.has(l));const un=[...c].filter(x=>!ok.has(x));return hit.length+' of '+L.length+(hit.length?' ('+hit.join(', ')+')':'')+'; unserved labels cited: '+(un.length?un.join(', '):'none');};
const t='as held in Sight #519 (S519). ... as established in Sight #2 (S2). ... as held by Drift Guard #18 (DG-18). ... as established in Drift Guard #8 (DG-8). ... as held in Sight #1583 (S1583). ... as noted in Sight #32 (S32).';
const served=['S-519','S-2','S-32','S-1583','#7'];
console.log('specimen:',SLC(served,[],[t]));
console.log('plain:',SLC(served,[],['Sight 519; S-2; Sights 32 and 1583; Conclusion #7']));
console.log('E constructed:',SLC(["S-32","S-519","S-8","S-9","#7","#12","S-1578"],["#12"],['As Sight 32 holds, and S-519 too; Sights 8, 9; Conclusion #7; see #12; Sight 99999 is not served. Matthew 1:16.']));
console.log('noise:',SLC(['S-1'],[],['Psalm 2:7; 1 Samuel 16:14; DG-61; LINK 3: SUPPORTED; S1 build; Acts 13:33']));
