describe('Playback tests', () => {

    /**
     * @type {Playback}
     */
    let playback;

    beforeEach(() => {
        playback = new Playback();
    });

    describe('Playback.getStatus', () => {

        beforeEach(() => {
            playback.activePlayer = mock(Player);
        });

        it(
          `Given an active player
          that is paused
          when i get the status
          the it should be Paused`,
          () => {
              playback.activePlayer.isPlaying = () => false;
              expect(playback.getStatus())
                .toEqual('Paused');
          }
        );

        it(
          `Given an active player
          that is playing
          when i get the status
          the it should be Playing`,
          () => {
              playback.activePlayer.isPlaying = () => true;
              expect(playback.getStatus())
                .toEqual('Playing');
          }
        );
    });

    describe('Playback.setLoopStatus', () => {
        beforeEach(() => {
            playback.activePlayer = mock(Player);
            playback.activePlayer.setLoop = function (loop) {
                this.loop = loop;
            };
        });

        parameterized(
          `Given an active player
          when i set the loop status to $status
          then the player's loop property should be $loop`,
          [
              { status: 'Playlist', loop: true },
              { status: 'Track', loop: true },
              { status: 'None', loop: false }
          ],
          (params) => {
              playback.setLoopStatus(params.status);
              expect(playback.activePlayer.loop).toBe(params.loop);
          }
        );
    });

    describe('Playback.getLoopStatus', () => {
        beforeEach(() => {
            playback.activePlayer = mock(Player);
        });

        parameterized(
          `Given an active player
          with loop = $loop
          when i get the loop status
          the it should be $status`,
          [
              { status: 'Track', loop: true },
              { status: 'None', loop: false }
          ],
          (params) => {
              playback.activePlayer.isLooping = () => params.loop;
              expect(playback.getLoopStatus())
                .toEqual(params.status);
          }
        );
    });

    describe('Playback.setActivePlayer', () => {

        it(
          `Given a valid player
        when i set it as active
        it should be the playbacks active player`,
          () => {
              let player = mock(Player);
              player.isValid = () => true;

              playback.setActivePlayer(player);
              expect(playback.activePlayer).toEqual(player);
          });

        it(
          `Given an invalid player
        when i set it as active
        it should not be set as the playbacks active player`,
          () => {
              let player = mock(Player);
              player.isValid = () => false;

              playback.setActivePlayer(player);
              expect(playback.activePlayer).toBe(null);
          });

    });

});
