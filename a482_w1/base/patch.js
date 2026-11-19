/* Loader. The dashboard additions that were in this file are served unchanged as patch-base.js.
   odv1.js (the Any vs Any debate tab) loads first so its tab is in place when patch-base.js calls boot().
   queue.js loads last and replaces the Queue tab's view with the current debates (2026-10-17). */
document.write('<script src="/odv1.js"><\/script><script src="/patch-base.js"><\/script><script src="/queue.js"><\/script><script src="/retire.js"><\/script>');
