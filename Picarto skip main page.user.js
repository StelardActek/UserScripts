// ==UserScript==
// @name         Picarto skip main page
// @namespace    http://stc.com/
// @version      0.3
// @description  Skips right to the explore page on picarto.tv
// @author       Stelard Actek
// @match        https://picarto.tv/
// @downloadURL  https://dl.dropboxusercontent.com/u/2360939/GMscripts/Picarto%20skip%20main%20page.user.js?dl=1
// @updateURL    https://dl.dropboxusercontent.com/u/2360939/GMscripts/Picarto%20skip%20main%20page.user.js?dl=1
// @grant        none
// @run-at document-start
// ==/UserScript==

window.document.location = "https://picarto.tv/communities/explore";