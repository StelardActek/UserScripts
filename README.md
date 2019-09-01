# UserScripts
A bunch of UserScripts (Greasemonkey, Tampermonkey, etc) which I wrote or edited and personally use

## So what do they do?
I guess I'll describe some of the newer/better ones as I go.

### [Twitter (Apr 2019) image direct download.user.js](https://stelardactek.github.io/UserScripts/Twitter%20(Apr%202019)%20image%20direct%20download.user.js)
Adds a little download button to every twitter image. Click it and directly download the *name=orig* version of that file, which should be the largest version available. No need to open a new tab or anything.

This version should work in Greasemonkey on Firefox as well as Tampermonkey on Chrome. It seems that, as of this writing, Tampermonkey has an issue on Firefox with the new Twitter UI which prevents it running any scripts unless you force refresh the page (Ctrl+F5).

### [Twitter image direct download.user.js](https://github.com/StelardActek/UserScripts/raw/master/Twitter%20image%20direct%20download.user.js)
Adds a little download button to every twitter image. Click it and directly download the *:orig* version of that file, which should be the largest version available. No need to open a new tab or anything. **Now outdated by the new Twitter UI, but still here in case people need it.**

### [Instagram image direct download.user.js](https://github.com/StelardActek/UserScripts/raw/master/Instagram%20image%20direct%20download.user.js)
Adds a little download button to every twitter image. Click it and directly download the largest version of that file. No need to open a new tab or anything.

### [FA Submissions.user.js](https://stelardactek.github.io/UserScripts/FA%20Submissions.user.js)
Adds a 'delete' button per image, and a 'nuke this section' button per section, to the FurAffinity submissions screen. Both will queue the deletes up for 10 seconds before actually doing anything, allowing you to abort by refreshing or leaving the page.
