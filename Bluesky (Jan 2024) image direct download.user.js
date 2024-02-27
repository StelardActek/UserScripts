// ==UserScript==
// @name         Bluesky (Jan 2024) image direct download
// @namespace    http://stc.com/
// @version      0.3
// @description  Adds a direct download button to Bluesky images that grabs the higher resolution file and renames the file.
// @author       Stelard Actek
// @match        https://bsky.app/*
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL  https://stelardactek.github.io/UserScripts/Bluesky%20(Jan%202024)%20image%20direct%20download.user.js
// @resource     download24 https://stelardactek.github.io/UserScripts/media/download24.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.4/FileSaver.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

(async function() {
    'use strict';

    const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    let dlUrl = await GM.getResourceUrl("download24");

  	if (dlUrl.indexOf('blob:') == 0) {
        let dlBlob = await fetch(dlUrl);
        dlUrl = await convertBlobToBase64(await dlBlob.blob());
    }

  	GM_addStyle(`
.dlAnchor {
  background-image: url("${dlUrl}");
  width: 24px;
  height: 24px;
  position: absolute;
  top: 0;
  background-color: transparent;
  border: none;
  pointer-events: all !important;
}

.dlAnchor:focus {
  outline: none !important;
  box-shadow: none;
}

@keyframes throb {
  0% {
    opacity: .9;
  }

  100% {
    opacity: .3;
  }
}

.dlAnchor.working {
  animation: throb 1s infinite;
  animation-direction: alternate;
  animation-timing-function: linear;
}
`);

  	let postRegex = /^.*\/profile\/([^\/]+)\/post\/(.+)$/;

    let getExtension = (filename) => {
        return filename.slice(filename.lastIndexOf('.'));
    };

    let dl = (url, filename, stateChange) => {
        console.log('Downloading', url, 'as', filename);
        stateChange(true);
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: (res) => {
                console.log('File loaded, preparing to save...');
                stateChange(false);
                saveAs(res.response, filename);
            },
            onerror: (res) => {
                console.log('Problem loading file.', res);
                stateChange(false);
            }
        });
    };

    let addTags = () => {
        console.log('Adding download tags...');

        let containers = document.querySelectorAll("div[data-expoimage=true]:not(.has-dlanchor)");
        if (containers && containers.length) {
            let prevCreatorId = '';
            let prevPostId = '';
          	let picCounter = 0;

          	for (let container of containers) {
                console.log('found container', container);

              	let img = container.querySelector("img");
              	let imgSrc = '';
                let creatorId = '';
                let postId = '';
              	let picId = 0;

              	if (img) {
                  	console.log('found img', img);

                  	let postMatch = document.location.href.match(postRegex);
                  	if (postMatch) {
                      	console.log('page match, article not needed');
                        creatorId = postMatch[1];
                      	postId = postMatch[2];
                    } else {
                      	let article = container.closest("div.css-175oi2r[role=link][data-testid]");
                      
                      	if (article) {
                          	console.log('found article', article);
                            let alink = article.querySelector('a.css-146c3p1.r-1loqt21[role=link][href^="/profile"][href*="/post/"]');
                            if (alink && alink.href) {
                                postMatch = alink.href.match(postRegex);

                                if (postMatch) {
                                    creatorId = postMatch[1];
                                    postId = postMatch[2];
                                }
                            }
                        }
                    }
                  
                  	if (img.src && img.src.indexOf('/img/feed_thumbnail/') > 0) {
                      	imgSrc = img.src.replace('/img/feed_thumbnail/', '/img/feed_fullsize/');
                    }
                  
                  	console.log('creatorId', creatorId, 'postId', postId, 'src', imgSrc);
                }
              
              	if (prevCreatorId == creatorId && prevPostId == postId) {
                  	picCounter++;
                } else {
                  	picCounter = 0;
                  	prevCreatorId = creatorId;
                  	prevPostId = postId;
                }
              
              	picId = picCounter;
              
              	if (imgSrc && creatorId && postId) {
                  	let dlAnchor = document.createElement('button');
                    dlAnchor.className = 'dlAnchor';
                    dlAnchor.title = 'Download this image...';
                    dlAnchor.addEventListener('click', (ev) => {
                      	console.log('click', 'creatorId', creatorId, 'postId', postId, 'src', imgSrc, 'picId', picId);
                      
                      	dl(
                            imgSrc,
                            `${creatorId}_${postId}_p${picId}${getExtension(imgSrc)}`,
                            (working) => {
                                if (working) {
                                    dlAnchor.classList.add('working');
                                    dlAnchor.disabled = true;
                                } else {
                                    dlAnchor.classList.remove('working');
                                    dlAnchor.disabled = false;
                                }
                            }
                        );
                      
                        ev.stopPropagation();
                        ev.preventDefault();
                        return false;
                    });
                  
                  	container.parentNode.append(dlAnchor);
                		container.classList.add('has-dlanchor');
                }
            }
        }
    };

    addTags();

    let stableWait = null;

    let observer = new MutationObserver((mutations) => {
        //console.log(mutations);
        // Naively wait for DOM mutations of any kind
        if (stableWait) {
            clearTimeout(stableWait);
        }
        stableWait = setTimeout(() => { stableWait = null; addTags(); }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
