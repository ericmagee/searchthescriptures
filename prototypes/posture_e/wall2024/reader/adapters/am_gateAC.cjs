// gateLineFor2024 ac(): the ANSWER CHECK key (verse|round) a gate change is matched by.
const {L}=require('./_util.cjs');
const s=String(L.gateLineFor2024);const m=s.match(/\.trim\(\)\.match\((\/\^(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!m)throw new Error('gateLineFor ac regex not found');const RX=eval(m[1]);
module.exports={name:'gateLineFor2024: ac()',form:'ANSWER CHECK',scope:'line',read(l){const r=String(l).replace(/[*_`]+/g,'').trim().match(RX);return r?{form:'ANSWER CHECK',verse:r[1].replace(/\s+/g,' '),round:r[2].toUpperCase()}:null;}};
