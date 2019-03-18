// ==UserScript==
// @name         Picarto Nice Emoticons
// @namespace    http://stc.com/
// @version      1.4
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
    ":y": ":cstelardactek-c5:"
};

var ignoreCase = true;




// Code - Don't edit this, unless you know what you're doing
$(document).ready(function () {
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    
    function replace(msg) {
        //msg.val(msg.val().replace(":0", ":c2:"));
        Object.keys(emoticonMap).forEach(function(key) {
            var val = emoticonMap[key];
            
            var rex = new RegExp(escapeRegExp(key), ignoreCase ? 'ig' : 'g');
            
            msg.val(msg.val().replace(rex, " " + val + " "));
        });
    }
    
    var msg = $("input#msg");
    if (msg && msg.length) {
        msg.on("keydown", function(ev) {
            if (ev.keyCode == 13) {
                replace(msg);
            }
        });
    }
    
    var send = $("input.sendbutton");
    if (send && send.length) {
        send.on("click", function(ev) {
            replace(msg);
        });
        var evts = jQuery._data($("input.sendbutton")[0], "events").click;
        evts.reverse();
    }
});
