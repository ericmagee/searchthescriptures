// ASK 430 patch (W1): L2 Count Plan, the KJV-renderings matcher `forms` also reads -d, -ed and -ied endings (plan a430_w1/plan_rev0.md).
// Usage: require('./p430.cjs')(liveL2CountPlanSource) -> patched source. Throws unless the old line occurs exactly once.
const OLD="for(const v of [l+'s',l+'es',l.replace(/y$/,'ies'),l.replace(/ies$/,'y'),l.replace(/es$/,''),l.replace(/s$/,'')])if(v)o.add(pre+v);";
const NEW="for(const v of [l+'s',l+'es',l.replace(/y$/,'ies'),l.replace(/ies$/,'y'),l.replace(/es$/,''),l.replace(/s$/,''),/[^e]e$/.test(l)?l+'d':'',l+'ed',/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(l)?l+l.slice(-1)+'ed':'',l.replace(/y$/,'ied'),l.replace(/ied$/,'y'),/^.{3,}ed$/.test(l)?l.replace(/ed$/,''):'',/[^e]ed$/.test(l)?l.replace(/d$/,''):'',l.replace(/([^aeiou])\\1ed$/,'$1')])if(v)o.add(pre+v);";
module.exports=function(src){const k=src.split(OLD).length-1;if(k!==1)throw new Error('ASK 430: forms line found '+k+' times');return src.replace(OLD,()=>NEW);};
module.exports.OLD=OLD;module.exports.NEW=NEW;
