// ==UserScript==
// @name        Tumblr image raw redirect
// @namespace   http://stc.com/
// @include     http://*.media.tumblr.com/*
// @include     https://*.media.tumblr.com/*
// @version     3
// @downloadURL  https://www.dropbox.com/s/rgxjcdc7pm67mqq/Tumblr_image_raw_redirect.user.js?raw=1
// @updateURL    https://www.dropbox.com/s/rgxjcdc7pm67mqq/Tumblr_image_raw_redirect.user.js?raw=1
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
  console.log('Attempting redirect...');

  //var r = /(\w+:\/\/)[\w\d]+\.media\.tumblr\.com\/(.*tumblr_.*_)\d+(\.\w+)/;
  var r = /(\w+:\/\/)([\w\d]+\.media\.tumblr\.com\/.*tumblr_.*_)(\d+)(\.\w+)/;
  var res = r.exec(document.URL);

  //if (res && res.length == 4) {
  if (res && res.length == 5 && res[3] != "1280") {
    //var redir = /*res[1]*/ 'http://' + "data.tumblr.com/" + res[2] + "raw" + res[3];
    var redir = res[1] + res[2] + "1280" + res[4];

    console.log('Redirecting to: ' + redir);

    window.location = redir;
  }
})();