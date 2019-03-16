# About
Out of the box this project has support for `video` and `audio` tags in all sites with the following features.
 - Play/Pause: play and pause it's playback.
 - Stop: pause the playback and go back to the start.
 - Seek: advance/go back 10 seconds.
 - Set position: indicate the desired position of playback.
 - Volume: control the medias pertinent volume.
 - Raise: show the tab that is playing the media.
 - Quit: close the tab that is playing the media.
 - Cover art: we use the sites domain to search for it's logo.
 - Looping: toggle between default playback or looping the current track.

## Providers

By extending this projects base classes it is possible to modify the default interaction with each site for specific sites. We call them providers. 

If you would like to contribute with a provider see the [how to](how_to.md) manual.
