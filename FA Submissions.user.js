// ==UserScript==
// @name        FA Submissions
// @namespace   http://stc.com/
// @include     http*://www.furaffinity.net/msg/submissions/*
// @version     4.4
// @downloadURL https://stelardactek.github.io/UserScripts/FA%20Submissions.user.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

// Anonymous function wrapper
(function() {
  var deleteDelay = 4000;

  GM_addStyle('div.stc_delete { cursor: pointer; text-align: center; position: absolute; left: 0px; font-size: 12pt; z-index: 10000; border-radius: 50%; color: white; background: IndianRed; border: 3px solid white; width: 1.5em; height: 1.5em; box-shadow: 0 0 5px #666666; margin: 5px }');
  GM_addStyle('section.gallery { text-align: left }');
  GM_addStyle('section.gallery * { text-align: center }');
  GM_addStyle('button.stc_nuke_section { margin-left: 2em; background-color: #FFAFAF; font-weight: bold; }');
  GM_addStyle('div.stc_delete_notice { position: fixed; left: 50%; top: 1em; transform: translateX(-50%); padding: 0.5em 1em; color: black; background: lightyellow; z-index: 5000000; display: none; }');
  //GM_addStyle('section.gallery figure { width: 194px }')

  $('body').prepend('<div class="stc_delete_notice">Delete pending...</div>');
  var notice = $('div.stc_delete_notice');

  var images = $('section.gallery > figure');
  images.prepend('<div class="stc_delete">x</div>');
  images.css('position', 'relative');

  var sectionHeaders = $('h3.date-divider');
  sectionHeaders.append('<button class="button stc_nuke_section">Nuke this section</button>');

  var toDelete = [];
  var timeout = null;

  function queueDelete(id) {
    toDelete.push(id);
    notice.text(toDelete.length + ' delete' + (toDelete.length == 1 ? '' : 's') + ' pending...');
    notice.fadeIn();
  }

  function deleteNow() {
    var ids = jQuery.unique(toDelete);
    toDelete = [];

    var parameters = 'messagecenter-action=remove_checked';
    $.each(ids, function(idx, id) {
      parameters += '&submissions[]=' + id;
    });

    $.ajax({
      url: '/msg/submissions/new@36/',
      type: 'POST',
      processData: false,
      data: parameters
    });

    notice.fadeOut();
  }

  $('div.stc_delete').click(function(ev) {
    ev.stopPropagation();

    if (timeout) {
      clearTimeout(timeout);
    }

    var block = $(this).parents('figure');

    queueDelete(block.find('input[type="checkbox"]').val());
    timeout = setTimeout(deleteNow, deleteDelay);

    block.fadeOut({
      duration: 100,
      complete: function() {
        block.remove();
      }
    });

    return false;
  });

  $('button.stc_nuke_section').click(function(ev) {
    ev.stopPropagation();

    if (timeout) {
      clearTimeout(timeout);
    }

    var header = $(this).parents('h3');
    var block = header.next('section.gallery');

    block.find('input[type="checkbox"]').each(function(idx, chk) {
      queueDelete($(chk).val());
    });
    timeout = setTimeout(deleteNow, deleteDelay);

    block.fadeOut({
      duration: 100,
      complete: function() {
        block.remove();
      }
    });
    header.fadeOut({
      duration: 100,
      complete: function() {
        header.remove();
      }
    });

    return false;
  });
})();
