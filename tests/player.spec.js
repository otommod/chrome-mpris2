suites['Player.js tests'] = {
    beforeEach (test) {
        test.element = {
            addEventListener: function () {},
            baseURI: 'http://mock.com'
        };
    },
    'given a media when i get the id it should return the elements URI': {
        given () {
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getId();
        },
        then () {
            expect(this.actual).to.equal('http://mock.com');
        }
    },
    'given a media with paused = $paused when i check if its playing it should be $expected': {
        given (params) {
            this.element.paused = params.paused;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.isPlaying();
        },
        then (params) {
            expect(this.actual).to.equal(params.expected);
        },
        data: [
            { paused: true, expected: false },
            { paused: false, expected: true }
        ]
    },
    'given a media with duration = $duration when i check its length it should be $expected': {
        given (params) {
            this.element.duration = params.duration;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getLength();
        },
        then (params) {
            expect(this.actual).to.equal(params.expected);
        },
        data: [
            { duration: 100, expected: 100000000 },
            { duration: 4687, expected: 4687000000 },
            { duration: 0, expected: 0 }
        ]
    },
    'given a media with volume = $volume that is not muted when i get its volume it should be $volume': {
        given (params) {
            this.element.volume = params.volume;
            this.element.muted = false;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getVolume();
        },
        then (params) {
            expect(this.actual).to.equal(params.volume);
        },
        data: [
            { volume: 1 },
            { volume: 0.4 }
        ]
    },
    'given a media that is muted when i get its volume it should be 0': {
        given () {
            this.element.muted = true;
            this.element.volume = 0.5;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getVolume();
        },
        then () {
            expect(this.actual).to.equal(0);
        }
    },
    'given a media when i set the players volume to $volume it should be changed to $volume': {
        given () {
            this.player = new Player(null, null, this.element);
        },
        when (params) {
            this.player.setVolume(params.volume);
        },
        then (params) {
            expect(this.player.element.volume).to.equal(params.volume);
        },
        data: [
            { volume: 1 },
            { volume: 0 },
            { volume: 0.4 },
            { volume: .76 },
        ]
    },
    'given a media when i set the rate to $rate it should be changed to $rate': {
        given () {
            this.player = new Player(null, null, this.element);
        },
        when (params) {
            this.player.setRate(params.rate);
        },
        then (params) {
            expect(this.player.element.playbackRate).to.equal(params.rate);
        },
        data: [
            { rate: 1 },
            { rate: 0 },
            { rate: 0.4 },
            { rate: .76 },
        ]
    },
    'given a media with playbackRate $rate when i get the rate it should be $rate': {
        given (params) {
            this.element.playbackRate = params.rate;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getRate();
        },
        then (params) {
            expect(this.actual).to.equal(params.rate);
        },
        data: [
            { rate: 1 },
            { rate: 2.0 },
            { rate: 0.2 }
        ]
    },
    'given a page with a title $title when i get the players title it should be $title': {
        given (params) {
            this.player = new Player({
                  getTitle: () => params.title
              },
              null,
              this.element);
        },
        when () {
            this.actual = this.player.getTitle();
        },
        then (params) {
            expect(this.actual).to.of.type.string()
              .and.equals(params.title);
        },
        data: [
            { title: 'My Site | Guau' },
            { title: 'Youtube' },
            { title: '/my/super/playlist' }
        ]
    },
    'given a media with a valid url $url when i get the artists it should be $artists': {
        given (params) {
            this.element.baseURI = params.url;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getArtists();
        },
        then (params) {
            expect(this.actual).to.be.of.type.array()
              .with.length(1)
              .and.contains(params.artists[0]);
        },
        data: [
            { url: 'http://google.com', artists: ['google.com'] },
            { url: 'https://youtube.com/watch?v=1231230912', artists: ['youtube.com'] },
            { url: 'http://soundcloud.com.ar/my/super/playlist', artists: ['soundcloud.com.ar'] }
        ]
    },
    'given a media with a valid url $url when i get the cover it should be $cover': {
        given (params) {
            this.element.baseURI = params.url;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getCover();
        },
        then (params) {
            expect(this.actual).to.be.of.type.string()
              .and.equals(params.cover);
        },
        data: [
            {
                url: 'http://google.com',
                cover: 'http://logo.clearbit.com/google.com'
            },
            {
                url: 'https://youtube.com/watch?v=1231230912',
                cover: 'http://logo.clearbit.com/youtube.com'
            },
            {
                url: 'http://soundcloud.com.ar/my/super/playlist',
                cover: 'http://logo.clearbit.com/soundcloud.com.ar'
            }
        ]
    },
    'given a media with currentTime $time when i get the position it should be $expected': {
        'given a media with currentTime $time' (params) {
            this.element.currentTime = params.time;
            this.player = new Player(null, null, this.element);
        },
        'when i get the position' () {
            this.actual = this.player.getPosition();
        },
        'it should be $expected' (params) {
            expect(this.actual).to.be.of.type.number()
              .and.equals(params.expected);
        },
        data: [
            { time: 50, expected: 50000000 },
            { time: 4687, expected: 4687000000 },
            { time: 0, expected: 0 }
        ]
    },
    'given a valid media that is paused when i call play it should work': {
        given (params) {
            this.element.play = function () {
                this.paused = false;
                return new Promise((resolve, reject) => {
                    resolve();
                });
            };
            this.element.paused = true;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.player.play();
        },
        then () {
            expect(this.element.paused)
              .to.be.of.type.boolean()
              .and.false();
        }
    },
    'given a valid media with a url = $url when i get the url it should be $url': {
        given (params) {
            this.element.baseURI = params.url;
            this.player = new Player(null, null, this.element);
        },
        when () {
            this.actual = this.player.getUrl();
        },
        then (params) {
            expect(this.actual).to.be.of.type.string()
              .and.a.URL()
              .and.equals(params.url);
        },
        data: [
            { url: 'http://google.com' },
            { url: 'http://youtube.com' }
        ]
    }
};
