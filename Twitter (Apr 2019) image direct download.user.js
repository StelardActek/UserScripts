// ==UserScript==
// @name         Twitter (Apr 2019) image direct download
// @namespace    http://stc.com/
// @version      0.11
// @description  Adds a direct download button to Twitter images that grabs the :orig file.
// @author       Stelard Actek
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL  https://stelardactek.github.io/UserScripts/Twitter%20(Apr%202019)%20image%20direct%20download.user.js
// @resource     download24 https://stelardactek.github.io/UserScripts/media/download24.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @connect      twimg.com
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

    /// Firefox doesn't support named capture groups yet
    //let urlRegex = /^(?<proto>[^:]+:)\/\/(?<host>[^\/]+)(?<path>[^\?]*)(?:\?(?<params>[^#]*)+)?/;
    let urlRegex = /^([^:]+:)\/\/([^\/]+)([^\?]*)(?:\?([^#]*)+)?/;
    let urlRegexIdx = {
        proto: 1,
        host: 2,
        path: 3,
        params: 4
    };

    let getFilename = (url) => {
        return url.slice(url.lastIndexOf('/') + 1);
    };

    let getExtension = (filename) => {
        return filename.slice(filename.lastIndexOf('.'));
    };

    let dl = (url, filename, stateChange) => {
        console.log('Downloading', url, 'as', filename);
        stateChange(true);
        try {
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
        } catch (err) {
            console.log('Error executing GM.xmlHttpRequest', err);
        }
    };

    let addTags = () => {
        console.log('Adding download tags...');

        let containers = document.querySelectorAll('article a[href*=photo] div[aria-label]:not(.has-dlanchor), div.AdaptiveMedia-photoContainer[data-image-url]:not(.has-dlanchor)');
        if (containers && containers.length) {
            for (let container of containers) {
                //console.log('found container', container);

                let dlAnchor = document.createElement('button');
                dlAnchor.className = 'dlAnchor';
                dlAnchor.title = 'Download this image...';
                dlAnchor.addEventListener('click', (ev) => {
                    let dataImgUrl = container.getAttribute('data-image-url');
                    let imgUrl = null;
                    let imgAs = null;

                    if (dataImgUrl) {
                        imgUrl = dataImgUrl + ':orig';
                        imgAs = getFilename(dataImgUrl)
                    } else {
                        let imgNodes = container.querySelectorAll('img.css-9pa8cd');
                        let format = null;
                        let path = null;

                        if (imgNodes && imgNodes[0]) {
                            let m = imgNodes[0].src.match(urlRegex);

                            if (m) {
                                path = m[urlRegexIdx.path];

                                let params = m[urlRegexIdx.params].split('&');
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

                                imgUrl = `${m[urlRegexIdx.proto]}//${m[urlRegexIdx.host]}${m[urlRegexIdx.path]}?${params.join('&')}`;
                            } else {
                                alert("Could not match image URL.");
                                return;
                            }
                        } else {
                            alert("Could not find image. Twitter UI might have changed.");
                            return;
                        }

                        imgAs = getFilename(path) + '.' + format;
                    }

                    //console.log('dlClick', imgUrl);
                    dl(
                        imgUrl,
                        imgAs,
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
