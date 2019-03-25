describe('Messenger tests', () => {

    /**
     * @type {Messenger}
     */
    let messenger;

    beforeEach(() => {
        messenger = new Messenger();
    });

    describe('Messenger.store', () => {
        it(
          `Given a new payload
          when i store it
          then it should be the cached value`,
          () => {
              let payload = {
                  data: 1
              };
              // noinspection JSCheckFunctionSignatures
              messenger.store(payload);
              expect(messenger.last).toEqual(payload);
          }
        );
    });

    describe('Messenger.onlyUpdated', () => {
        parameterized(
          `given a stored payload
          and a new payload
          when i compare them
          then i should get only the updated values`,
          [
              {
                  stored: { 'PlaybackStatus': 'Playing' },
                  payload: { 'PlaybackStatus': 'Paused' },
                  expected: { 'PlaybackStatus': 'Paused' }
              },
              {
                  stored: { 'PlaybackStatus': 'Playing' },
                  payload: { 'PlaybackStatus': 'Playing' },
                  expected: {}
              },
              {
                  stored: { PlaybackStatus: 'Playing', LoopStatus: 'None' },
                  payload: { PlaybackStatus: 'Playing', LoopStatus: 'Track' },
                  expected: { LoopStatus: 'Track' }
              },
              {
                  stored: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 10
                      }
                  },
                  payload: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 10
                      }
                  },
                  expected: {}
              },
              {
                  stored: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 11
                      }
                  },
                  payload: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 10
                      }
                  },
                  expected: {
                      Metadata: {
                          'mpris:length': 10
                      }
                  }
              },
              {
                  stored: {
                      Metadata: {
                          'xesam:artist': ['artist']
                      }
                  },
                  payload: {
                      Metadata: {
                          'xesam:artist': ['this']
                      }
                  },
                  expected: {
                      Metadata: {
                          'xesam:artist': ['this']
                      }
                  }
              }
          ],
          (params) => {
              messenger.last = params.stored;
              expect(messenger.onlyUpdated(params.payload))
                .toEqual(params.expected);
          }
        );
    });

    describe('Messenger.payloadFrom', () => {
        it(
          `Given a playback
          with an active player
          when i build a payload
          it should be as expected`,
          () => {
              let playback = new Playback();
              playback.activePlayer = mock(Player,{
                  isPlaying: () => true,
                  isLooping: () => false,
                  getVolume: () => 1,
                  getId: () => 'id',
                  getLength: () => 10000000,
                  getCover: () => 'default.jpg',
                  getUrl: () => 'http://mock.com',
                  getTitle: () => 'my title',
                  getArtists: () => ['artist'],
                  getSiteDomain: () => 'http://site.com',
                  getRate: () => 1
              });

              expect(messenger.payloadFrom(playback))
                .toEqual({
                    'CanGoNext': false,
                    'CanGoPrevious': false,
                    'Identity': 'http://site.com',
                    'LoopStatus': 'None',
                    'Metadata': {
                        'mpris:artUrl': 'default.jpg',
                        'mpris:length': 10000000,
                        'mpris:trackid': 'id',
                        'xesam:artist': [
                            'artist'
                        ],
                        'xesam:title': 'my title',
                        'xesam:url': 'http://mock.com',
                    },
                    'PlaybackStatus': 'Playing',
                    'Rate': 1,
                    'Shuffle': false,
                    'Volume': 1,
                });
          }
        );
    });

    describe('Messenger.requestPayload', () => {
        it(
          `given store it`,
          () => {
              messenger.last = {
                  'CanGoNext': false,
                  'CanGoPrevious': false,
                  'Identity': 'http://site.com',
                  'LoopStatus': 'None',
                  'Metadata': {
                      'mpris:artUrl': 'default.jpg',
                      'mpris:length': 10000000,
                      'mpris:trackid': 'id',
                      'xesam:artist': [
                          'artist'
                      ],
                      'xesam:title': 'my title',
                      'xesam:url': 'http://mock.com',
                  },
                  'PlaybackStatus': 'Playing',
                  'Rate': 1,
                  'Shuffle': false,
                  'Volume': 1,
              };
              let playback = new Playback();
              playback.activePlayer = mock(Player,{
                  isPlaying: () => true,
                  isLooping: () => false,
                  getVolume: () => 1,
                  getId: () => 'id',
                  getLength: () => 10000000,
                  getCover: () => 'default.jpg',
                  getUrl: () => 'http://mock.com',
                  getTitle: () => 'my title',
                  getArtists: () => ['artist'],
                  getSiteDomain: () => 'http://site.com',
                  getRate: () => 1
              });
              expect(messenger.requestPayload(playback))
                .toEqual({});
              expect(messenger.last).toEqual({
                  'CanGoNext': false,
                  'CanGoPrevious': false,
                  'Identity': 'http://site.com',
                  'LoopStatus': 'None',
                  'Metadata': {
                      'mpris:artUrl': 'default.jpg',
                      'mpris:length': 10000000,
                      'mpris:trackid': 'id',
                      'xesam:artist': [
                          'artist'
                      ],
                      'xesam:title': 'my title',
                      'xesam:url': 'http://mock.com',
                  },
                  'PlaybackStatus': 'Playing',
                  'Rate': 1,
                  'Shuffle': false,
                  'Volume': 1,
              });
          }
        )
    });

});
