// ==UserScript==
// @name        DA ad block notice hider
// @namespace   http://steltechcor.com/
// @include     http://*.deviantart.com/*
// @version     1
// @grant       GM_addStyle
// @run-at      document-start
// ==/UserScript==

GM_addStyle("#block-notice { display: none; }");
