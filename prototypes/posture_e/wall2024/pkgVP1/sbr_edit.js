  /* pkgVP1 part 1 (W3; md_notes_rulings 459), RECORD-ONLY: the cure reading of a replaced line is written to the row's cure_status, so no send-back row is left unread. Nothing is counted and no seat is removed here. */
  {const __r=rows[rows.length-1];if(__r.cure_status==null&&!it.grt2&&!silent&&!err){
   if((it.rule==='E-ANS'||it.rule==='E-PREM')&&!it.abs&&!it.b7&&!it.ksc&&!it.imp&&!it.mnp&&!it.pab&&__ec&&(__ec.status==='CURED'||__ec.status==='UNCURED'))__r.cure_status=__ec.status;
   else if(it.rule==='E-OOR'&&a&&a.ans==='CHANGE'){let __o=null;try{__o=vp1Oor2024(a.to,__RD);}catch(e){__o=null;}if(__o){__r.cure_status=__o.status;__r.cure_reason+=' | CURE (E-OOR code reading of the replaced line, pkgVP1; record-only): '+__o.status+' -- '+__o.why;}}}}
