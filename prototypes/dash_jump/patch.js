/* Loader. The dashboard additions that were in this file are served unchanged as patch-base.js.
   odv1.js (the Any vs Any debate tab) loads first so its tab is in place when patch-base.js calls boot().
   judge591.js (ASK 591, the Judge order tab) loads after odv1.js, whose odOpts and odMName it uses.
   jump.js loads after retire.js and makes Jump to # wait for typing to stop (2026-11-24).
   queue.js loads last and replaces the Queue tab's view with the current debates (2026-10-17). */
document.write('<script src="/odv1.js"><\/script><script src="/judge591.js"><\/script><script src="/patch-base.js"><\/script><script src="/queue.js"><\/script><script src="/retire.js"><\/script><script src="/jump.js"><\/script>');
