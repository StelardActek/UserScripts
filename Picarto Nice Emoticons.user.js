// ==UserScript==
// @name         Picarto Nice Emoticons
// @namespace    http://steltechcor.com/
// @version      2.0
// @description  Replaces emoticon strings of your chosing with your custom emotes
// @author       Stelard Actek
// @match        https://picarto.tv/*
// @downloadURL  https://github.com/StelardActek/UserScripts/raw/master/Picarto%20Nice%20Emoticons.user.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';



// Settings - Edit these
var emoticonMap = {
    "^^/": ":cstelardactek-c1:",
    ":0": ":cstelardactek-c2:",
    ":o": ":cstelardactek-c2:",
    ":box:": ":cstelardactek-c3:",
    ":b": ":cstelardactek-c3:",
    ":zzz:": ":cstelardactek-c4:",
    ":z": ":cstelardactek-c4:",
    ":peace:": ":cstelardactek-c5:",
    ":y": ":cstelardactek-c5:",
    ">:D": ":cstelardactek-c6:",
    "<3": ":cstelardactek-c7:"
};

var ignoreCase = true;




// Code - Don't edit this, unless you know what you're doing
(function () {
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function replace(msg) {
        Object.keys(emoticonMap).forEach(function(key) {
            var val = emoticonMap[key];

            var rex = new RegExp(escapeRegExp(key), ignoreCase ? 'ig' : 'g');
            msg.value = msg.value.replace(rex, " " + val + " ");
        });
    }

    function keyEvent(ev) {
        //console.log('keydown', ev.keyCode, ev);
        if (ev.keyCode == 13) {
            replace(ev.srcElement);
        }
    }

    function sendClick(ev) {
        let msg = document.querySelectorAll("textarea.rta__textarea");
        if (msg && msg.length) {
            replace(msg[0]);
        }
    }

    let hook = () => {
        let msg = document.querySelectorAll("textarea.rta__textarea");
        //console.log('msg', msg);
        if (msg && msg.length) {
            msg.forEach(e => {
                e.removeEventListener("keydown", keyEvent);
                e.addEventListener("keydown", keyEvent);
            });
        }

        let send = document.querySelectorAll("i.anticon-send[title='Send message']");
        //console.log('send', send);
        if (send && send.length) {
            send.forEach(e => {
                e.removeEventListener("click", sendClick);
                e.addEventListener("click", sendClick);
            });
        }
    }

    hook();

    let stableWait = null;

    let observer = new MutationObserver((mutations) => {
        //console.log(mutations);
        // Naively wait for DOM mutations of any kind
        if (stableWait) {
            clearTimeout(stableWait);
        }
        stableWait = setTimeout(() => { stableWait = null; hook(); }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
