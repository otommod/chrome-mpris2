# YouTube Provider
This works on [youtube's](https://www.youtube.com/) main site and also on all embedded videos.

Besides the defaults ones, this provider adds the following features.

## Metadata
### Cover Art
We'll use the videos id to download the current video thumbnail.

At the moment this does not work when on a user or a channels page.

### Title
We can get the title from the videos elements.

### Artists
We'll try to get the video's owner. This will not work on embedded videos.

## Playback
### Next
only if the `next` button is enabled.

### Previous
only if the `previous` button is enabled.

### Rate
when setting the rate perform the action through the UI.

### Volume
the UI follows the changes made from the interface.

### Shuffle
If the shuffle playlist is present, we can control it

### Looping
It works

