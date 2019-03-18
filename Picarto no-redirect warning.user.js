// ==UserScript==
// @name         Picarto no-redirect warning
// @namespace    http://stc.com/
// @version      0.1
// @description  Skip the 'you are leaving picarto' warning
// @author       Stelard Actek
// @match        https://picarto.tv/*
// @downloadURL  https://github.com/StelardActek/UserScripts/raw/master/Picarto%20no-redirect%20warning.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        //console.log('tick...');

        let links = document.querySelectorAll('a[href*="/site/referrer"]');

        for (let x = 0; x < links.length; x++) {
            let link = links[x];
            //console.log('found ', link.href, link);

            let match = link.href.match(/[\?&]go=([^&]+)/);
            if (match && match[1]) {
                let newHref = decodeURIComponent(match[1]);
                link.href = newHref;
            }
        }
    }, 500);
})();
