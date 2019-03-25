describe('Page tests', () => {

    /**
     * @type {Host}
     */
    let host;
    /**
     * @type {Playback}
     */
    let playback;
    /**
     * @type {Page}
     */
    let page;

    beforeEach(() => {
        host = mock(Host);
        playback = mock(Playback);

        page = new Page(null, playback, host);
    });

    describe('Page.registerPlayer', () => {
        it(
          `Given a new page
      and a new element
      when i register the element
      then it should be added to the list`,
          () => {
              let element = mock(HTMLMediaElement);
              element.baseURI = 'http://mock.com';
              element.duration = 100000;
              element.paused = true;

              expect(page.registerPlayer(element)).toBe(true);
              expect(page.players[0].element).toEqual(element);
          }
        );
        it(
          `Given a new element
      that is playing
      when i register the element
      then it should be added to the list`,
          () => {
              let spy = spyOn(host, 'start');

              let element = mock(HTMLMediaElement);
              element.baseURI = 'http://mock.com';
              element.duration = 100000;
              element.paused = false;

              expect(page.registerPlayer(element)).toBe(true);
              expect(spy).toHaveBeenCalled();
              expect(page.players[0].element).toEqual(element);
          }
        );
        it(
          `Given a new page
      with an element
      when i register the element
      then it should not be added to the list`,
          () => {
              let element = mock(HTMLMediaElement);
              element.baseURI = 'http://mock.com';

              page.players = [new Player(page, host, element)];

              expect(page.registerPlayer(element)).toBe(false);
              expect(page.players[0].element).toEqual(element);
          }
        );
    });

    describe('page.onMutate', () => {

        let elements = [
            mock(HTMLElement, { querySelectorAll: () => [] }),
            mock(HTMLMediaElement, {
                baseURI: 'http://mock.com',
                matches: () => true,
                querySelectorAll: () => []
            }),
            mock(HTMLMediaElement, {
                baseURI: 'http://mock2.com',
                matches: () => true,
                querySelectorAll: () => []
            }),
            mock(HTMLElement, {
                querySelectorAll: () => [
                    elements[1],
                    elements[2]
                ]
            })
        ];

        parameterized(
          `Given a page
          when elements are added to the dom
          then all the players present should be registered`,
          [
              { elements: [], times: 0 },
              { elements: [elements[0]], times: 0 },
              {
                  elements: [
                      { matches: () => null, querySelectorAll: () => [] }
                  ], times: 0
              },
              {
                  elements: [
                      Object.assign(elements[1], { querySelectorAll: () => [elements[1]] })
                  ], times: 1
              },
              {
                  elements: [
                      elements[1],
                      elements[2]
                  ], times: 2
              },
              {
                  elements: [
                      elements[3]
                  ],
                  times: 2
              }
          ],
          (params) => {
              let mutations = [
                  {
                      addedNodes: params.elements
                  }

              ];

              const spy = spyOn(page, 'registerPlayer');

              page.onMutate(mutations);

              expect(spy).toHaveBeenCalledTimes(params.times);
              // expect(page.players.length).toBeGreaterThanOrEqual(params.times);
          }
        );
    });
});
