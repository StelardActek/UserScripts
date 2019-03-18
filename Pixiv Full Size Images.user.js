// ==UserScript==
// @name           Pixiv Full Size Images
// @namespace      http://stc.com/
// @description    Forces Pixiv to display full size images without extra clicks
// @include        /^https?://www\.pixiv\.net/member_illust.php.*/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js
// @grant          GM_addStyle
// @grant          GM_getResourceText
// ==/UserScript==

// Anonymous function wrapper
(function() {
    var data = $('.work-info .meta');
    var img = $('.works_display img');
    var imgCount = null;
    var players = $('._ugoku-illust-player-container .wrapper');

    // Add CSS
    GM_addStyle(`
.works_display {
    width: unset;
    overflow: unset;
    margin: 0 auto 20px;
}
#illust-recommend {
    float: left !important;
    margin-left: -190px;
    margin-right: unset !important;
}
`);

    // Remove margin
	$('#wrapper').css('margin', 0);

    // Detect ugoira player
    if (players && players[0])
    {
        var player = players[0];
        var thumbs = $('meta[property="og:image"]');
        if (thumbs && thumbs[0])
        {
            var thumb = thumbs[0];
            var match = /^https?:\/\/[\w\d]+\.pixiv.net\/img-inf\/([\w\d\/]+\/\d+)(?:_s)?\.\w+$/.exec(thumb.content);
            
            if (match && match[1])
            {
                var newLink = jQuery('<a/>', {
                    href: "http://i1.pixiv.net/img-zip-ugoira/" + match[1] + "_ugoira1920x1080.zip",
                    text: "Download 1920x1080"
                });	

                $(player).prepend(newLink);
                $(player).prepend($("<br/>"));

                newLink = jQuery('<a/>', {
                    href: "http://i1.pixiv.net/img-zip-ugoira/" + match[1] + "_ugoira600x600.zip",
                    text: "Download 600x600"
                });

                $(player).prepend(newLink);
            }
        }
    }
    else
    {
        // Unroll mangas
        for (var x = 0; x < data.length; x++)
        {
            var match = data[x].innerHTML.match(/(?:.+) (\d+)P/);

            if (match != null)
            {
                imgCount = parseInt(match[1], 10);
            }
        }

        for (var x = 0; x < img.length; x++)
        {
            var item = img[x];

            if (item.src == null)
                return;

            var match = item.src.match(/^(?:(.*\/)(\d+)_m(.*)|(https?:\/\/[^\/]+\/)(?:.*img\/)(.*\/)(\d+)(_p\d*)_master\d*(\.\w+))$/);

            if (match != null)
            {
                if (imgCount != null)
                {
                    var worksDiv = jQuery('<div/>',
                    {
                        className: 'works_display'
                    });

                    for (var x = 0; x < imgCount; x++)
                    {
                        var imgDiv = jQuery('<div/>', { style: "padding: 15px;" });
                        var img = jQuery('<img/>', { 
                            src: match[1] ? match[1] + match[2] + "_big_p" + x + match[3] : match[4] + "img-original/img/" + match[5] + match[6] + "_big_p" + x + ".png",
                            onerror: function() {
                                if (this.src.indexOf('_big_') !== -1 && this.src.indexOf('.png') !== -1)
                                {
                                    this.src = this.src.replace('.png', '.jpg');
                                    return;
                                }
                                if (this.src.indexOf('_big_') !== -1 && this.src.indexOf('.jpg') !== -1)
                                {
                                    this.src = this.src.replace('.jpg', '.png');
                                    this.src = this.src.replace('_big_', '_');
                                    return;
                                }
                                if (this.src.indexOf('.png') !== -1)
                                {
                                    this.src = this.src.replace('.png', '.jpg');
                                    return;
                                }
                            }
                        });

                        imgDiv.append("<p>" + (x+1) + "/" + imgCount + "</p>");

                        worksDiv.append(imgDiv);
                        imgDiv.append(img);
                    }

                    $('.works_display').replaceWith(worksDiv);
                }
                else
                {
                    /*
                    var dlLink = $('<a />');
                    $(item.parentNode).replaceWith(dlLink);
                    dlLink.append(item);
                    */
                    
                    var src = match[1] + match[2] + match[3] || match[4] + "img-original/img/" + match[5] + match[6] + match[7] + '.png';
                    
                    /*
                    dlLink = dlLink[0];
                    dlLink.download = "download.jpg";
                    dlLink.href = src;
                    dlLink.target = "_blank";
                    
                            var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        dlLink.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(dlLink.href);
                    */
                    
                    item.src = src;
                    item.onerror = function() {
                        if (this.src.indexOf('.png') !== -1)
                        {
                            this.src = this.src.replace('.png', '.jpg');
                            //dlLink.href = this.src;
                            return;
                        }
                    }
                }
            }
        }
    }
})(); // end anonymous function wrapper

