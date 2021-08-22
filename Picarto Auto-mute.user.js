// ==UserScript==
// @name         Picarto Auto-mute
// @namespace    http://steltechcor.com/
// @version      1.0
// @description  Mutes all streams by default
// @author       Stelard Actek
// @include      https://*.picarto.tv/*
// @include      https://picarto.tv/*
// @downloadURL  https://github.com/StelardActek/UserScripts/raw/master/Picarto%20Auto-mute.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  let hook = () => {
    const unmuted = document.querySelectorAll(".mistvideo-container svg.icon.speaker:not(.off)");
    
    if (unmuted && unmuted.length) {
      console.log('Found new unmuted stream:', unmuted);
      setTimeout(() => { unmuted.forEach(e => e.dispatchEvent(new MouseEvent("click"))); }, 100);
    }
  }

  hook();

  let observer = new MutationObserver(mutations => {
    //console.log('mutations', mutations);

    for (const mutation of mutations) {
      if (mutation.type == "childList" && mutation.addedNodes) {
        const matches = Array.prototype.filter.call(mutation.addedNodes, node => node.matches(".mistvideo-placeholder"));
        if (matches && matches.length) {
        	hook();
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
