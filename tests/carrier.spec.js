describe('Carrier tests', () => {

    /**
     * @type {Carrier}
     */
    let carrier;

    beforeEach(() => {
        carrier = new Carrier();
    });

    describe('Carrier.store', () => {
        it(
          `Given a new payload
          when i store it
          then it should be the cached value`,
          () => {
              let payload = {
                  data: 1
              };
              // noinspection JSCheckFunctionSignatures
              carrier.store(payload);
              expect(carrier.last).toEqual(payload);
          }
        );
    });

    describe('Carrier.clear', () => {
        it(
          `Given a stored payload
          when i clear it
          then the stored value should be the default`,
          () => {
              carrier.last = {
                  PlaybackStatus: 'Playing',
                  Metadata: {}
              };
              carrier.clear();
              expect(carrier.last)
                .toEqual({});
          }
        )
    });

    describe('Carrier.onlyUpdated', () => {
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
              },
              {
                  stored: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 11,
                          'mrpis:trackid': '123'
                      }
                  },
                  payload: {
                      PlaybackStatus: 'Playing',
                      LoopStatus: 'None',
                      Metadata: {
                          'mpris:length': 11,
                          'mrpis:trackid': '124'
                      }
                  },
                  expected: {
                      Metadata: {
                          'mpris:length': 11,
                          'mrpis:trackid': '124'
                      }
                  }
              }
          ],
          (params) => {
              carrier.last = params.stored;
              expect(carrier.onlyUpdated(params.payload))
                .toEqual(params.expected);
          }
        );
    });

    describe('Carrier.payloadFrom', () => {
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

              expect(carrier.payloadFrom(playback))
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

    describe('Carrier.requestPayload', () => {
        it(
          `given store it`,
          () => {
              carrier.last = {
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
              expect(carrier.requestPayload(playback))
                .toEqual({});
              expect(carrier.last).toEqual({
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
