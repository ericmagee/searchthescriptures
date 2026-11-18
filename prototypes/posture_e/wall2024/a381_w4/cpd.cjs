const fs=require('fs');const T=require('../tools/lib.cjs');
const run=f=>{const d=JSON.parse(fs.readFileSync(f));const U=T.unpack(d);const L=U.L,M=U.M;const i=L.findIndex(x=>x.startsWith('function cpdSync('));
 const users=Object.keys(M).filter(k=>M[k].p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&i>=e[0]&&i<=e[1])));
 const S=T.load(T.rb(L,M["Cure Check"]));return {users,S};};
const R='DEFENDER CONCEDED LINKS: 2 -- Premise 2, LINK 2: UNEXHIBITED (Commitment 5), because the answers assume Mary’s Davidic ancestry. Premise 5, LINK 5: UNEXHIBITED (Commitment 5), because the Hebrews 2:16 answer assumes it. Premises 1, 3, 4 and 6 are spared.\nCHALLENGE STANDING: PROP-DEPENDENT -- L=2 c=2 -- derived after the send-back.\nCHALLENGER CONCEDED LINKS: 2 -- Premise 1 is NOT VOID but UNEXHIBITED because its proven press was left unmet; premise 2 is NOT VOID but UNEXHIBITED because its answers to its proven presses rely on absence.\nCONTRADICTIONS: NONE FOUND.';
const j=JSON.stringify({verdict_tag:'BROKEN',conceded_links:2,challenger_conceded_links:2,counted_premises_defender:[2,5],counted_premises_challenger:[],reasoning:R},null,2);
const pre={conceded_links:2,challenger_conceded_links:0};
for(const [nm,f] of [['OLD s262','rdf/fetchback_s262.json'],['NEW t381','a381/t381.json']]){const {users,S}=run(f);const r=S.cpdSync(j,pre,'chatgpt');const ob=JSON.parse(r.j);
 console.log(nm,'| cpdSync in',users.length,'stubs |',r.mark.trim().slice(0,260),'| counted_premises_challenger =',JSON.stringify(ob.counted_premises_challenger),'| defender =',JSON.stringify(ob.counted_premises_defender));}
