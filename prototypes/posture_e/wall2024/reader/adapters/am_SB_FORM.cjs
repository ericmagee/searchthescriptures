// sbApply2024 SB_FORM: whether a CHANGE TO line "has a line form the engine reads". Returns {accepted:true} or null. No fields.
const {L}=require('./_util.cjs');
module.exports={name:'sbApply2024: SB_FORM',form:'ANY',scope:'line',read(l){const s=String(l).replace(/\s+/g,' ').trim();return L.SB_FORM.test(s)?{accepted:true}:null;}};
