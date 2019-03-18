// ==UserScript==
// @name        DA ad block notice hider
// @namespace   http://stc.com/
// @include     http://*.deviantart.com/*
// @version     1.1
// @downloadURL https://github.com/StelardActek/UserScripts/raw/master/DA%20ad%20block%20notice%20hider.user.js
// @grant       GM_addStyle
// @run-at      document-start
// ==/UserScript==

GM_addStyle("#block-notice { display: none; }");
