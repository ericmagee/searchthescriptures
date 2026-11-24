/* Retires the Debate and Challenger tabs (their flows no longer exist; operator 2026-10-27). Loads last. */
(function(){for(var k=TABS.length-1;k>=0;k--){if(TABS[k][0]==='debate'||TABS[k][0]==='challenger')TABS.splice(k,1);}if(cur==='debate'||cur==='challenger'){cur='overview';if(PASS){renderTabs();setupCtl();loadTab();}}else if(PASS){renderTabs();}})();
