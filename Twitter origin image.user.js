// ==UserScript==
// @name         twitter origin image
// @namespace    http://qqboxy.blogspot.com
// @version      0.3
// @description  jump to origin image link
// @author       QQBoxy
// @include      http://*pbs.twimg.com/media/*
// @include      https://*pbs.twimg.com/media/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var is_orig = window.location.href.match(/\:orig$/);
    if(!is_orig) {
		var match = window.location.pathname.match(/^([^:]+)(\:?[^:]*)$/);
    	window.location.href = window.location.origin + match[1] +":orig";
    }
})();
