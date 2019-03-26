// ==UserScript==
// @name         Instagram image direct download
// @namespace    http://stc.com/
// @version      0.1
// @description  Adds a direct download button to Twitter images that grabs the :orig file.
// @author       Stelard Actek
// @match        https://www.instagram.com/*
// @include      https://instagram.com/*
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @resource     download24 https://github.com/StelardActek/UserScripts/raw/master/media/download24.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @connect      cdninstagram.com
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.dlAnchor {
  background-image: url("${GM_getResourceURL('download24')}");
  width: 24px;
  height: 24px;
  position: absolute;
  top: 0;
  background-color: transparent;
  border: none;
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

    let getFilename = (url) => {
        let noPath = url.slice(url.lastIndexOf('/') + 1);
        let qryIdx = noPath.indexOf('?');
        if (qryIdx >= 0) {
            return noPath.slice(0, qryIdx);
        } else {
            return noPath;
        }
    };

    let getExtension = (filename) => {
        return filename.slice(filename.lastIndexOf('.'));
    };

    let dl = (url, filename, stateChange) => {
        console.log('Downloading', url, 'as', filename);
        stateChange(true);
        GM_xmlhttpRequest({
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

    let readSrcSet = (img) => {
        if (!img.srcset)
            return null;

        let srcset = img.srcset.split(',').map(s => s.split(' ')).map(a => { return { url: a[0], size: Number(a[1].replace(/[^\d]/g, '')) }; });
        //console.log('srcset', srcset);

        let biggest = srcset.reduce((t, c) => {
            if (c.size > t.size) {
                return c;
            } else {
                return t;
            }
        }, { url: null, size: 0 });
        console.log('biggest', biggest);

        if (biggest) {
            return biggest.url;
        } else {
            return null;
        }
    };

    let addTags = () => {
        console.log('Adding download tags...');

        let cover = document.querySelector('div._9AhH0');
        if (cover) {
            cover.remove();
        }

        let imgs = document.querySelectorAll('img.FFVAD:not(.has-dlanchor)');
        if (imgs && imgs.length) {
            for (let img of imgs) {
                let container = img.parentElement;
                let src = readSrcSet(img) || img.src;
                //console.log('found container', container);

                let dlAnchor = document.createElement('button');
                dlAnchor.className = 'dlAnchor';
                dlAnchor.title = 'Download this image...';
                dlAnchor.addEventListener('click', (ev) => {
                    dl(
                        src,
                        getFilename(src),
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

                container.append(dlAnchor);
                img.classList.add('has-dlanchor');
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
