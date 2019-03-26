describe('Host tests', () => {

    /**
     * @type {Host}
     */
    let host;

    beforeEach(() => {
        host = new Host(
          mock(Playback),
          mock(Carrier),
          {
              onMessage: {
                  addListener () {}
              }
          }
        );
    });

    describe('Host.get', () => {

        it(
          `Given a GET request
          when it is for the position
          it should the playback's position
          `,
          () => {
              host.playback.getPosition = () => 10;

              expect(host.get('id', 'Position'))
                .toBe(10);
          }
        );

    });

    describe('Host.set', () => {

        parameterized(
          `Given a SET request
          when it's the $propName
          then the playback $propName should be set`,
          [
              { method: 'setRate', propName: 'Rate', newValue: 10 },
              { method: 'setVolume', propName: 'Volume', newValue: 10 },
              { method: 'setShuffle', propName: 'Shuffle', newValue: true },
              { method: 'setShuffle', propName: 'Shuffle', newValue: false },
              { method: 'setLoopStatus', propName: 'LoopStatus', newValue: 'Track' },
              { method: 'setLoopStatus', propName: 'LoopStatus', newValue: 'Playlist' },
              { method: 'setLoopStatus', propName: 'LoopStatus', newValue: 'None' },
              { method: 'toggleFullScreen', propName: 'Fullscreen' },
              { method: 'toggleFullScreen', propName: 'Fullscreen' }
          ],
          (params) => {
              let spy = spyOn(host.playback, params.method);
              if (params.newValue)
                  spy.withArgs(params.newValue);
              host.set('id', params.propName, params.newValue);
              expect(spy).toHaveBeenCalledTimes(1);
          }
        );

    });

    describe('Host.command', () => {

        parameterized(
          `Given a COMMAND request
          when it's the $command
          then the playback $method should called`,
          [
              { method: 'play', command: 'Play' },
              { method: 'pause', command: 'Pause' },
              { method: 'togglePlayback', command: 'PlayPause' },
              { method: 'stop', command: 'Stop' },
              { method: 'next', command: 'Next' },
              { method: 'previous', command: 'Previous' },
              { method: 'seek', command: 'Seek', args: [10000] },
              { method: 'setPosition', command: 'SetPosition', args: ['id', 10000] }
          ],
          (params) => {
              let spy = spyOn(host.playback, params.method);
              if (params.args) {
                  spy.withArgs(...params.args);
                  host.command(params.command, ...params.args);
              } else
                  host.command(params.command);
              expect(spy).toHaveBeenCalledTimes(1);
          }
        );

    });

    describe('Host.messageListener', () => {
        parameterized(
          `Given a request
          with a method $method
          when the port sends a message
          then redirect correctly
          and return a message if expected`,
          [
              { method: 'Get', redirect: 'get', ret: 1, change: 0, result: 1 },
              { method: 'Set', redirect: 'set', ret: 0, change: 1 },
              { method: 'Play', redirect: 'command', ret: 0, change: 1 },
              { method: 'Pause', redirect: 'command', ret: 0, change: 1 },
              { method: 'PlayPause', redirect: 'command', ret: 0, change: 1 },
              { method: 'Stop', redirect: 'command', ret: 0, change: 1 },
              { method: 'Next', redirect: 'command', ret: 0, change: 1 },
              { method: 'Previous', redirect: 'command', ret: 0, change: 1 },
              { method: 'Seek', redirect: 'command', ret: 0, change: 1 },
              { method: 'SetPosition', redirect: 'command', ret: 0, change: 1 }
          ],
          (params) => {
              let spy = spyOn(host, params.redirect);
              spy.and.returnValue(params.result);
              let retSpy = spyOn(host, 'return');
              let changeSpy = spyOn(host, 'change');

              host.messageListener({
                  method: params.method,
                  args: []
              });

              expect(spy).toHaveBeenCalled();
              expect(retSpy).toHaveBeenCalledTimes(params.ret);
              expect(changeSpy).toHaveBeenCalledTimes(params.change);
          }
        );
    });

});
