// ==UserScript==
// @name         Instagram full-res
// @namespace    http://stc.com/
// @version      0.3
// @description  try to take over the world!
// @author       Stelard Actek
// @match        https://www.instagram.com/p/*
// @downloadURL  https://github.com/StelardActek/UserScripts/raw/master/deprecated/Instagram%20full-res.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let process = () => {
        let cover = document.querySelector('div._9AhH0');
        if (cover) {
            cover.remove();
        }

        let img = document.querySelector('img.FFVAD');
        //console.log('img', img);

        let readSrcSet = () => {
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
                img.setAttribute('src', biggest.url);
                img.removeAttribute('sizes');
                img.removeAttribute('srcset');
            }
        };

        if (img) {
            if (img.srcset) {
                console.log('via page load');
                readSrcSet();
            } else {
                let obs = new MutationObserver((mutations, observer) => {
                    //console.log('mutations', mutations);

                    let srcsetMutations = mutations.filter(m => m.attributeName == 'srcset');
                    if (srcsetMutations) {
                        obs.disconnect();
                        console.log('via mutations', srcsetMutations);
                        readSrcSet();
                    }
                });

                obs.observe(img, { attributes: true });
            }

            return true;
        } else {
            console.log('img not found');
            return false;
        }
    };

    if (!process()) {
        setTimeout(process, 250);
    }
})();
