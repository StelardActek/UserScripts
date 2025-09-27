// ==UserScript==
// @name     		Pixiv Image Source Link
// @version  		1
// @grant    		none
// @include			/\d+_p\d+_master/
// ==/UserScript==

(function () {
  'use strict';

  function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = "GM_addStyleBy8626";
      document.head.appendChild(style);
      return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
  }
  
  console.log('Pixiv image detected');
  
  let oldLnks = document.querySelectorAll('a.PixivImageSourceLink');
  if (oldLnks && oldLnks.length > 0) {
    for (let oldLnk of oldLnks) {
      console.log('Removing old link:', oldLnk);
      oldLnk.remove();
    }
  }
  
  GM_addStyle(`
  	.PixivImageSourceLink {
    	border-radius: 0.5em;
      background-color: #1fa3fb;
      padding: 0.125em 0.5em;
      
      color: #f6f6f6;
      text-decoration: none;
      
      font-family: "win-bug-omega", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
      font-size: 14px;
      line-height: 22px;
      font-weight: 700;
      
      margin: 0.5em;
  		position: absolute;
    }
  `);
  
  let pixivIdRegex = /(\d+)_p\d+/;
  let pixivIdMatches = pixivIdRegex.exec(window.location);
  
  if (pixivIdMatches.length > 1) {
  	let pixivUrl = `https://pixiv.net/en/artworks/${pixivIdMatches[1]}`;
    
    console.log('Pixiv url:', pixivUrl);
    
    let lnk = document.createElement('a');
    lnk.innerHTML = 'Pixiv';
    lnk.href = pixivUrl;
    lnk.classList.add('PixivImageSourceLink');
    document.body.appendChild(lnk);
  }
})();
