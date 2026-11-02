// judge_fix6 H8 (run 32293: the K-LB check added in judge_fix5 fired falsely on every seat and removed a correct judge, GLM): THE ENFORCER STATUS
// TABLE, the one place a rule's status is set (lib/status.js; the patch copies this block unchanged into every node that counts or reports items).
// LIVE: an item left UNCURED counts in drv_uncured, and a seat with drv_uncured above 0 is removed for an alternate, as before.
// TRIAL: the rule's marks are written to the seat's text, the review notes and the enforcer log, and its items are sent to the judge's cure for a
// RESPONSE; an item left UNCURED is reported as such but never counts in drv_uncured, so it never removes a seat, and a TRIAL item never raises
// the count another item's cure must reach. A rule not in the table is LIVE. A new check enters as TRIAL and becomes LIVE only by an edit here,
// after it has proved itself on stored text. C4-RENUM and C4-PRESS (the close-round numbering and press checks) make notes, never items.
const ENF_STATUS={'K-B':'LIVE','K-C':'LIVE','K-G1':'LIVE','K-G3':'LIVE','K-G4':'LIVE','K-G6':'LIVE','K-G7':'LIVE','K-G8':'LIVE','K-N':'LIVE','K-S':'LIVE','K-SC':'LIVE',
 'K-LB':'TRIAL','K-G9':'TRIAL','C4-RENUM':'TRIAL','C4-PRESS':'TRIAL'};
const enfStatus=r=>ENF_STATUS[String(r||'')]==='TRIAL'?'TRIAL':'LIVE';
const enfLive=x=>enfStatus(x&&x.rule)==='LIVE';
const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&enfLive(x)).length;
const enfTrialWhy=(x,why)=>enfLive(x)?why:'TRIAL rule (recorded and answered; it removes no seat)'+(why?': '+why:'');
