# How To
If you would like to contribute with a provider please follow this steps.

## 0. Default Works
Ensure the media elements in the site you are interested in are detected.

_if you can't control the media by default then it probably wont be solved by following this instructions._

## 1. Create a provider
Create a .js file inside src/providers/ with then name (kebab-cased) of the site.

## 2. Update manifest.json
Edit the [manifes.json](https://github.com/Lt-Mayonesa/browser-mpris2/blob/master/manifest.json), by adding an item to the `"content_scripts"` array.
1. the item's `"js"` property should contain the path to the file you created in the previous step
2. the item's `"matches"` property should contain a valid match for the site. See [content_scripts](https://developer.chrome.com/extensions/content_scripts) for more info.
3. ie:
```json
{
  "matches": ["*://*.youtube.com/*", "*://youtube.com/*"],
  "js": [
    "src/providers/youtube.js"
  ],
  "run_at": "document_start",
  "all_frames": true
}
```

## 3. Write your provider
Edit your provider's .js file by extending and re-assigning (see snippets below) any of the classes inside `src/main/` as needed. 

You are most likely to only need to extend any of the following three.

### [Player](https://lt-mayonesa.github.io/browser-mpris2/class/src/main/player.js~Player.html)

Besides other things a player defines the metadata (title, artis, coverArt, length) that is sent to the mpris2 interface.
One page will often hold more than one `Player`, but only one of them will be the `activePlayer`.

```javascript
class MySitePlayer extends Player {

   getCover() {
       return document.getElementById('element-holding-the-image').getAttribute('src');
   } 

}
Player = MySitePlayer;
```

### [Playback](https://lt-mayonesa.github.io/browser-mpris2/class/src/main/playback.js~Playback.html) (singleton)

This controls the playback of the page. You should override this class in order to better interact with your site.

```javascript
class MySitePlayback extends Playback {

   setLoopStatus (status) {
       document.getElementById('button-that-toogles-loop').click();
   }

}
Playback = MySitePlayback;
```

### [Page](https://lt-mayonesa.github.io/browser-mpris2/class/src/main/page.js~Page.html) (singleton)

A page is in charge of registering and handling media elements.

It wouldn't be strange that you don't have the need to extend this class.

```javascript
   class MySitePage extends Page {

       getTitle() {
           return document.getElementById('element-with-title').textContent;
       }

   }
   Page = MySitePage;
```

## 4. Document it
Add a .md file to the `manual/` directory containing a summary of what this provider accomplishes. Don't forget to add it to the [.esdoc.json](https://github.com/Lt-Mayonesa/browser-mpris2/blob/master/manifest.json) under the plugins's `name-standard-plugin.option.manual.files` property.

## 5. PR it
Go ahead and create a pull request. They are always welcome.
