# Netflix Provider
This works on [Netflix](https://netflix.com) site when watching a show (aka: netflix.com/watch)

Besides the defaults ones, this provider adds the following features.

## Valid Media
We define our own isValid, so we don't register netflix's trailers on the home page.

## Metadata
### Title
Show current show/movie title (ie: S1:E1 Pilot)

### Artists
Show current show/movie. (ie: Breaking Bad)

## Playback
### Next
If the `'skip intro'` button is showing, pressing `next` will click that.
Else, if the `next` button is enabled, go to next episode.

### Seek
Netflix breaks when seeking by modifying the media element. So when seeking press the +10/-10 seconds buttons.

### Set Position
Netflix breaks when setting the position by modifying the media element. For now is disabled.

### Rate
Rate is disabled.

### Loop
Loop is disabled.

### Shuffle
Shuffle is disabled.
