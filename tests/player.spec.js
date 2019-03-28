/**
 * @test {Player}
 */
describe('Player tests', () => {

    let page;
    let element;
    /**
     * @type {Player}
     */
    let player;

    beforeEach(() => {
        page = {};

        element = mock(HTMLMediaElement);
        element.baseURI = 'http://mock.com';

        player = new Player(page, null, element);
    });

    /**
     * @test {Player#getId}
     */
    describe('Player.getId', () => {
        it(`given a media
        when i get the id
        it should return the elements URI`,
          () => expect(player.getId()).toBe('http://mock.com')
        );
    });

    /**
     * @test {Player#isPlaying}
     */
    describe('Player.isPlaying', () => {
        parameterized(
          `given a media with paused = $paused
             when i check if the player is playing
             it should be $expected`,
          [
              { paused: true, expected: false },
              { paused: false, expected: true }
          ],
          (params) => {
              element.paused = params.paused;
              expect(player.isPlaying())
                .toBe(params.expected);
          }
        );
    });

    /**
     * @test {Player#getLength}
     */
    describe('Player.getLength', () => {
        parameterized(
          `given a media with duration = $duration
             when i get the player's length
             it should be $expected`,
          [
              { duration: 100, expected: 100000000 },
              { duration: 4687, expected: 4687000000 },
              { duration: 0, expected: 0 }
          ],
          (params) => {
              element.duration = params.duration;
              expect(player.getLength())
                .toBe(params.expected);
          }
        );
    });

    /**
     * @test {Player#getVolume}
     */
    describe('Player.getVolume', () => {
        parameterized(
          `given a media with volume = $volume
             with muted = $muted
             when i get the player's volume 
             it should be $expected`,
          [
              { volume: 1, muted: false, expected: 1 },
              { volume: 0.4, muted: false, expected: 0.4 },
              { volume: 1, muted: true, expected: 0 },
              { volume: 0.4, muted: true, expected: 0 }
          ],
          (params) => {
              element.volume = params.volume;
              element.muted = params.muted;

              expect(player.getVolume())
                .toBe(params.expected);
          }
        );
    });

    /**
     * @test {Player#setVolume}
     */
    describe('Player.setVolume', () => {
        parameterized(
          `given a player
            when i set the players volume to $volume
            then the media volume be $volume`,
          [
              { volume: 1 },
              { volume: 0 },
              { volume: 0.4 },
              { volume: .76 },
          ],
          (params) => {
              player.setVolume(params.volume);

              expect(element.volume)
                .toBe(params.volume);
          }
        );
    });

    /**
     * @test {Player#setRate}
     */
    describe('Player.setRate', () => {
        parameterized(
          `given a player
            when i set the rate to $rate
            then the playbackRate should be $rate`,
          [
              { rate: 1 },
              { rate: 0 },
              { rate: 0.4 },
              { rate: .76 }
          ],
          (params) => {
              player.setRate(params.rate);

              expect(element.playbackRate)
                .toBe(params.rate);
          }
        );
    });

    /**
     * @test {Player#getRate}
     */
    describe('Player.getRate', () => {
        parameterized(
          `given a media with playbackRate $rate
          when i get the the player's rate
          it should be $rate`,
          [
              { rate: 1 },
              { rate: 2.0 },
              { rate: 0.2 }
          ],
          (params) => {
              element.playbackRate = params.rate;

              expect(player.getRate())
                .toBe(params.rate);
          }
        );
    });

    /**
     * Test player's title integration
     *
     * @test {Player#getTitle}
     */
    describe('Player.getTitle', () => {
        parameterized(
          `given a page with a title $title
          when i get the players title
          it should equal $title`,
          [
              { title: 'My Site | Guau' },
              { title: 'Youtube' },
              { title: '/my/super/playlist' }
          ],
          (params) => {
              page.getTitle = function () {
                  return params.title;
              };
              expect(player.getTitle())
                .toBe(params.title);
          }
        );
    });

    /**
     * The artists are parsed correctly from the url
     *
     * @test {Player#getArtists}
     */
    describe('Player.getArtists', () => {
        parameterized(
          `given a media with a valid url $url
          when i get the artists
          it should be $artists`,
          [
              { url: 'http://google.com', artists: ['google.com'] },
              { url: 'https://youtube.com/watch?v=1231230912', artists: ['youtube.com'] },
              { url: 'http://soundcloud.com.ar/my/super/playlist', artists: ['soundcloud.com.ar'] }
          ],
          (params) => {
              element.baseURI = params.url;
              player = new Player(page, null, element);

              expect(player.getArtists())
                .toEqual(params.artists);
          }
        );
    });

    /**
     * Feature:
     *
     * @test {Player#getCover}
     */
    describe('Player.getCover', () => {
        parameterized(
          `given a media with a valid url $url
          when i get the player's cover
          it should be $cover`,
          [
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
          ],
          (params) => {
              element.baseURI = params.url;
              player = new Player(page, null, element);

              expect(player.getCover())
                .toBe(params.cover);
          }
        );
    });

    describe('Player.getPosition', () => {
        parameterized(
          `given a media with currentTime $time
          when i get the player's position
          it should be $expected`,
          [
              { time: 50, expected: 50000000 },
              { time: 4687, expected: 4687000000 },
              { time: 0, expected: 0 }
          ],
          (params) => {
              element.currentTime = params.time;

              expect(player.getPosition())
                .toBe(params.expected);
          }
        );
    });

    describe('Player.play', () => {
        it(
          `given a valid media that is paused
          when i call play
          it should start playing`,
          () => {
              element.play = function () {
                  this.paused = false;
                  return new Promise((resolve) => {
                      resolve();
                  });
              };
              element.paused = true;

              return player.play()
                .then(() => {
                    expect(element.paused).toBe(false);
                });
          }
        );
    });

    describe('Player.getUrl', () => {
        parameterized(
          `given a valid media with a url = $url
          when i get the player's url
          it should be $url`,
          [
              { url: 'http://google.com' },
              { url: 'http://youtube.com' }
          ],
          (params) => {
              element.baseURI = params.url;
              player = new Player(page, null, element);

              expect(player.getUrl())
                .toEqual(params.url);
          }
        );
    });

    describe('Player.isLooping', () => {
        parameterized(
          `given a media with loop = $loop
          when i check the player's looping state
          it should be $loop`,
          [
              { loop: true },
              { loop: false }
          ],
          (params) => {
              element.loop = params.loop;

              expect(player.isLooping()).toBe(params.loop);
          }
        );
    });

    describe('Player.setLoop', () => {
        parameterized(
          `given a player
            when i set the players loop status to $loop
            then the media loop status be $loop`,
          [
              { loop: true },
              { loop: false }
          ],
          (params) => {
              player.setLoop(params.loop);

              expect(element.loop).toBe(params.loop);
          }
        );
    });

    describe('Player.pause', () => {
        it(
          `given a media that is not paused
          when i pause the player
          it should be paused`,
          () => {
              element.pause = function () {
                  this.paused = true;
              };
              element.paused = false;

              player.pause();

              expect(element.paused).toBe(true);
          });
        it(
          `given a media that is paused
          when i pause the player
          it should stay paused`,
          () => {
              element.pause = function () {
                  this.paused = true;
              };
              element.paused = false;

              player.pause();

              expect(element.paused).toBe(true);
          });
    });

    describe('Player.playPause', () => {
        parameterized(
          `given a media with paused = $paused
          when i toggle the player
          then playing should be $expected`,
          [
              { paused: true, expected: false },
              { paused: false, expected: true }
          ],
          (params) => {
              element.pause = function () {
                  this.paused = true;
              };
              element.play = function () {
                  this.paused = false;
                  return new Promise((resolve) => {
                      resolve();
                  });
              };
              element.paused = params.paused;

              player.playPause();

              expect(element.paused).toBe(params.expected);
          }
        );
    });

    describe('Player.stop', () => {
        parameterized(
          `given a media with paused = $paused
          when i stop the player
          then paused should be $paused
          and it's currentTime should be 0`,
          [
              { paused: true, expected: false },
              { paused: false, expected: true }
          ],
          (params) => {
              element.pause = function () {
                  this.paused = true;
              };
              element.paused = params.paused;

              player.stop();

              expect(element.paused).toBe(true);
              expect(element.currentTime).toBe(0);
          });
    });

    describe('Player.seek', () => {
        parameterized(
          `given a media with currentTime = $time
          when i seek by $offset seconds
          then currentTime should be $expected`,
          [
              { time: 10, offset: 10, expected: 20 },
              { time: 10, offset: -10, expected: 0 },
              { time: 0, offset: 100, expected: 100 },
              { time: 0, offset: -10, expected: -10 },
          ],
          (params) => {
              element.currentTime = params.time;

              player.seek(params.offset * 1e6);

              expect(element.currentTime).toBe(params.expected);
          }
        );
    });

    describe('Player.setPosition', () => {
        parameterized(
          `given a media with currentTime = $time
          when i set the position to be $position
          then currentTime should be $expected`,
          [
              { time: 10, position: 10, expected: 10 },
              { time: 10, position: 0, expected: 0 },
              { time: 10, position: 100, expected: 100 },
          ],
          (params) => {
              element.currentTime = params.time;

              player.setPosition(params.position * 1e6);

              expect(element.currentTime).toBe(params.expected);
          }
        );
    });

    describe('Player.getSiteDomain', () => {
        parameterized(
          `given a valid media with a url = $url
          when i get the player's site domain
          it should be $expected`,
          [
              { url: 'http://google.com', expected: 'google.com' },
              { url: 'http://www.youtube.com', expected: 'www.youtube.com' }
          ],
          (params) => {
              element.baseURI = params.url;
              player = new Player(page, null, element);

              expect(player.getSiteDomain())
                .toEqual(params.expected);
          }
        );
    });

    describe('Player.isHidden', () => {
        it(
          `given a media with no offset parent
          when i check if the player is hidden
          then it should be true`,
          () => {
              element.offsetParent = null;

              expect(player.isHidden()).toBe(true);
          }
        );

        it(
          `given a media with a offset parent
          when i check if the player is hidden
          then it should be false`,
          () => {
              element.offsetParent = {};

              expect(player.isHidden()).toBe(false);
          }
        );
    });

    describe('Player.isValid', () => {
        parameterized(
          `given a media wit duration = $duration
          when i check if the player is valid
          it should be $valid`,
          [
              { duration: 0, valid: false },
              { duration: NaN, valid: false },
              { duration: 5, valid: false },
              { duration: 6, valid: true },
              { duration: 10000, valid: true }
          ],
          params => {
              element.duration = params.duration;

              expect(player.isValid()).toBe(params.valid);
          }
        );
    });

});
