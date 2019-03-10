suites['Page.js tests'] = {
    'Register a new player': {
        'given a new page' () {
            this.page = new Page(null, null, null);
        },
        'and a new element' () {
            this.element = {
                addEventListener: function () {},
                baseURI: 'http://mock.com'
            };
        },
        'when i register the element' () {
            this.added = this.page.registerPlayer(this.element);
        },
        'then it should be added to the list' () {
            expect(this.added)
              .to.be.of.type.boolean()
              .and.true();
            expect(this.page.players).of.type.array()
              .is.notEmpty()
              .and.with.length(1);
            expect(this.page.players[0].element)
              .to.equal(this.element);
        }
    },
    'Register added player': {
        'given an element' () {
            this.element = {
                addEventListener() {},
                baseURI: 'https://mock.com'
            }
        },
        'and a page with that element' () {
            this.page = new Page(null, null, null);
            this.page.players = [new Player(this.page,null, this.element)];
        },
        'when i register the element' () {
            this.added = this.page.registerPlayer(this.element);
        },
        'then it should not be added' () {
            expect(this.added)
              .to.be.of.type.boolean()
              .and.false();
            expect(this.page.players)
              .to.be.of.type.array()
              .and.with.length(1);
            expect(this.page.players[0].element)
              .to.equal(this.element);
        }
    }
};
