suites['Messenger.js tests'] = {
    'Store most recent payload': {
        'given a new payload' () {
            this.payload = {
                data: 1
            };
        },
        'and a new payload' () {
            this.messenger = new Messenger();
        },
        'when i store it' () {
            this.messenger.store(this.payload);
        },
        'then it should be the cached value' () {
            expect(this.messenger.last)
              .to.be.of.type.object()
              .and.equal(this.payload);
        }
    },
    'Get updated values from payload': {
        'given a payload' () {
            this.messenger = new Messenger();
        },
        'with a stored payload' (params) {
            this.messenger.last = params.stored;
        },
        'and a new payload' (params) {
            this.payload = params.payload;
        },
        'when i compare the playLoads' () {
            this.diffs = this.messenger.onlyUpdated(this.payload);
        },
        'then i should get only the updated values' (params) {
            expect(this.diffs)
              .to.be.of.type.object()
              .and.is.equal(params.expected);
        },
        data: [
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
                stored: { 'PlaybackStatus': 'Playing' },
                payload: { 'PlaybackStatus': 'Playing', 'Volume': 1 },
                expected: { 'Volume': 1 }
            },
            {
                stored: { 'PlaybackStatus': 'Playing' },
                payload: { 'PlaybackStatus': 'Paused', 'Volume': 1 },
                expected: { 'PlaybackStatus': 'Paused', 'Volume': 1 }
            },
            {
                stored: { 'PlaybackStatus': 'Playing', 'Volume': 1 },
                payload: { 'PlaybackStatus': 'Paused', 'Volume': 1 },
                expected: { 'PlaybackStatus': 'Paused' }
            },
            {
                stored: {
                    PlaybackStatus: 'Paused',
                    LoopStatus: 'None',
                    Shuffle: false,
                    Volume: 1,
                    CanGoNext: false,
                    CanGoPrevious: false,
                    Identity: 'ident',
                    Rate: 1,
                    Metadata: {
                        'mpris:trackid': '123kadsf',
                        'mpris:length': 100000000,
                        'mpris:artUrl': 'my/cover',
                        'xesam:url': 'url/domain',
                        'xesam:title': 'my song',
                        'xesam:artist': ['my artists']
                    }
                },
                payload: {
                    PlaybackStatus: 'Paused',
                    LoopStatus: 'None',
                    Shuffle: false,
                    Volume: 1,
                    CanGoNext: false,
                    CanGoPrevious: false,
                    Identity: 'ident',
                    Rate: 1,
                    Metadata: {
                        'mpris:trackid': '123kadsf',
                        'mpris:length': 100000000,
                        'mpris:artUrl': 'my/cover',
                        'xesam:url': 'url/domain',
                        'xesam:title': 'my song',
                        'xesam:artist': ['my artists'],
                    }
                },
                expected: {}
            },
            {
                stored: {
                    PlaybackStatus: 'Paused',
                    LoopStatus: 'None',
                    Shuffle: false,
                    Volume: 1,
                    CanGoNext: false,
                    CanGoPrevious: false,
                    Identity: 'ident',
                    Rate: 1,
                    Metadata: {
                        'mpris:trackid': '123kadsf',
                        'mpris:length': 100000000,
                        'mpris:artUrl': 'my/cover',
                        'xesam:url': 'url/domain',
                        'xesam:title': 'my song',
                        'xesam:artist': ['my artists'],
                    }
                },
                payload: {
                    PlaybackStatus: 'Playing',
                    LoopStatus: 'Track',
                    Shuffle: true,
                    Volume: .2,
                    CanGoNext: true,
                    CanGoPrevious: false,
                    Identity: 'ident',
                    Rate: .4,
                    Metadata: {
                        'mpris:trackid': '123kadsasdff',
                        'mpris:length': 200000000,
                        'mpris:artUrl': 'my/asdfasd',
                        'xesam:url': 'url/domain..com',
                        'xesam:title': 'my song 2',
                        'xesam:artist': ['my artists', 'arits'],
                    }
                },
                expected: {
                    PlaybackStatus: 'Playing',
                    LoopStatus: 'Track',
                    Shuffle: true,
                    Volume: .2,
                    CanGoNext: true,
                    Rate: .4,
                    Metadata: {
                        'mpris:trackid': '123kadsasdff',
                        'mpris:length': 200000000,
                        'mpris:artUrl': 'my/asdfasd',
                        'xesam:url': 'url/domain..com',
                        'xesam:title': 'my song 2',
                        'xesam:artist': ['my artists', 'arits'],
                    }
                }
            }
        ]
    },
    'Build a payload object correctly': {
        'given a messenger' () {
            this.messenger = new Messenger();
        },
        'and a playback' () {
            this.playback = new Playback();
        },
        'with an active player' () {
            this.playback.setActivePlayer(new Player(
              {
                  getTitle: () => 'my title'
              },
              null,
              {
                  addEventListener () {},
                  duration: 1,
                  baseURI: 'http://mock.com'
              }));
        },
        'when the messenger builds the payload' () {
            this.payload = this.messenger.payloadFrom(this.playback);
        },
        'then it should be built correctly' () {
            expect(this.payload)
              .to.be.of.type.object()
              .and.equal({
                  PlaybackStatus: 'Playing',
                  LoopStatus: 'None',
                  Shuffle: false,
                  CanGoNext: false,
                  CanGoPrevious: false,
                  Rate: undefined,
                  Identity: 'mock.com',
                  Volume: undefined,
                  Metadata: {
                      'mpris:trackid': 'http://mock.com',
                      'mpris:length': 1000000,
                      'mpris:artUrl': 'http://logo.clearbit.com/mock.com',
                      'xesam:url': 'http://mock.com',
                      'xesam:title': 'my title',
                      'xesam:artist': ['mock.com']
                  }
              }
            );
        }
    }
};
