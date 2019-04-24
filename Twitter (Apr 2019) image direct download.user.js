// ==UserScript==
// @name         Twitter (Apr 2019) image direct download
// @namespace    http://stc.com/
// @version      0.1
// @description  Adds a direct download button to Twitter images that grabs the :orig file.
// @author       Stelard Actek
// @match        https://twitter.com/*
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL  https://github.com/StelardActek/UserScripts/raw/master/Twitter%20image%20direct%20download.user.js
// @resource     download24 https://github.com/StelardActek/UserScripts/raw/master/media/download24.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @connect      twimg.com
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

    let urlRegex = /^(?<proto>[^:]+:)\/\/(?<host>[^\/]+)(?<path>[^\?]*)(?:\?(?<params>[^#]*)+)?/;

    let getFilename = (url) => {
        return url.slice(url.lastIndexOf('/') + 1);
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

    let addTags = () => {
        console.log('Adding download tags...');

        let containers = document.querySelectorAll('article[data-testid="tweetDetail"] div[aria-label="Image"]:not(.has-dlanchor)');
        if (containers && containers.length) {
            for (let container of containers) {
                //console.log('found container', container);
                if (container.style && container.style.margin) {
                    container.style.margin = "";
                }

                let dlAnchor = document.createElement('button');
                dlAnchor.className = 'dlAnchor';
                dlAnchor.title = 'Download this image...';
                dlAnchor.addEventListener('click', (ev) => {
                    let imgNodes = container.querySelectorAll('img.css-9pa8cd');
                    let imgUrl = null;
                    let format = null;
                    let path = null;

                    if (imgNodes && imgNodes[0]) {
                        let m = imgNodes[0].src.match(urlRegex);

                        path = m.groups.path;

                        if (m) {
                            let params = m.groups.params.split('&');
                            params = params.map(param => {
                                let [key, value] = param.split('=');

                                if (key == 'format') {
                                    format = value;
                                }

                                if (key == 'name') {
                                    return `${key}=orig`;
                                } else {
                                    return param;
                                }
                            });

                            imgUrl = `${m.groups.proto}//${m.groups.host}${m.groups.path}?${params.join('&')}`;
                        } else {
                            alert("Could not match image URL.");
                            return;
                        }
                    } else {
                        alert("Could not find image. Twitter UI might have changed.");
                        return;
                    }

                    //console.log('dlClick', imgUrl);
                    dl(
                        imgUrl,
                        getFilename(path) + '.' + format,
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
                container.classList.add('has-dlanchor');
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
