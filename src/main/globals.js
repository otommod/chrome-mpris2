/**
 *
 * @type {Object}
 * @property {string} CHANGE=changed - whether a mrpis2 property has changed
 * @property {string} RETURN=return - if we are returning an expected value
 * @property {string} SEEK=seeked - seeking
 * @property {string} QUIT=quit - inform to close the player
 */
const MessageType = {
    CHANGE: 'changed',
    RETURN: 'return',
    SEEK: 'seeked',
    QUIT: 'quit'
};

/**
 *
 * @constant {Object}
 * @property {string} GET=Get - request a property from the client
 * @property {string} SET=Set - request to set a property in the client
 * @property {string} PLAY=Play - request to start playing the current media
 * @property {string} PAUSE=Pause - request to pause the current media
 * @property {string} TOGGLE=PlayPause - request to toggle playback of current media
 * @property {string} STOP=Stop - request to completely stop playback
 * @property {string} NEXT=Next - request to skip to next media
 * @property {string} PREVIOUS=Previous - request to skip to previous media
 * @property {string} SEEK=Seek - request to move current playback position by some offset
 * @property {string} SET_POSITION=SetPosition - request to move current playback position to specific point
 */
const MessageMethod = {
    GET: 'Get',
    SET: 'Set',
    PLAY: 'Play',
    PAUSE: 'Pause',
    TOGGLE: 'PlayPause',
    STOP: 'Stop',
    NEXT: 'Next',
    PREVIOUS: 'Previous',
    SEEK: 'Seek',
    SET_POSITION: 'SetPosition'
};

/**
 *
 * @constant {Object}
 * @property {string} POSITION=Position - the time of playback
 * @property {string} RATE=Rate - the speed rate of playback
 * @property {string} VOLUME=Volume - the volume of playback
 * @property {string} SHUFFLE=Shuffle - the shuffle state of playback
 * @property {string} LOOP_STATUS=LoopStatus - the loop status of playback
 * @property {string} FULL_SCREEN=Fullscreen - the fullscreen state
 */
const MessageProperty = {
    POSITION: 'Position',
    RATE: 'Rate',
    VOLUME: 'Volume',
    SHUFFLE: 'Shuffle',
    LOOP_STATUS: 'LoopStatus',
    FULL_SCREEN: 'Fullscreen'
};

/**
 * Constants for playback looping support
 *
 * By default only <b>NONE</b> and <b>TRACK</b> are supported,
 * <b>PLAYLIST</b> looping should be implemented by provider
 *
 *
 * @constant {Object}
 * @property {string} NONE=None - default playback
 * @property {string} TRACK=Track - playback will loop current track
 * @property {string} PLAYLIST=Playlist - playback will loop current playlist
 */
const LoopStatus = {
    NONE: 'None',
    TRACK: 'Track',
    PLAYLIST: 'Playlist'
};

/**
 * Constants for playback status
 *
 * @constant {Object}
 * @property {string} PLAYING=Playing - the media is playing
 * @property {string} PAUSED=Paused - the media is paused
 */
const PlaybackStatus = {
    PLAYING: 'Playing',
    PAUSED: 'Paused'
};

/**
 * @typedef {Object} Metadata
 * @property {string} 'mpris:trackid' - the track id (can be anything)
 * @property {number} 'mpris:length' - the length of the media
 * @property {string} 'mpris:artUrl' - the url of the cover image
 * @property {string} 'xesam:url' - the url of the media
 * @property {string} 'xesam:title' - the title of the media
 * @property {Array<string>} 'xesam:artist' - an array containing the artists
 */

/**
 * A payload that the native app understands
 *
 * @typedef {Object} Payload
 * @property {string} PlaybackStatus - Playing or Paused
 * @property {LoopStatus} LoopStatus - the loop status
 * @property {boolean} Shuffle - is shuffle on
 * @property {number} Volume - the volume
 * @property {boolean} CanGoNext - if the next button should be enabled
 * @property {boolean} CanGoPrevious - if previous button should be enabled
 * @property {string} Identity - the identity of the mpris player
 * @property {number} Rate - the playback speed of the media
 * @property {Metadata} Metadata - the media specific information
 */

