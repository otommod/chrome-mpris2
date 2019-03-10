const suites = {};

const expect = function (obj) {
    return new Assertable(obj);
};

class Titb extends EventEmitter {
    constructor () {
        super();
        this.logs = [];
        this.keywords = [
            'setup',
            'given',
            'with',
            'and',
            'when',
            'then',
            'it'
        ];
    }

    test (spec, title, parameters) {
        let suite = suites[spec];
        let test = suites[spec][title];

        let reg = new RegExp('(^(' + this.keywords.join('|') + ')\\W)|(^(' + this.keywords.join('|') + ')$)', 'gi');

        if (!Object.keys(test).filter(key => key.match(reg)).length)
            throw new Error('Test object needs at least one implementation of any given, when, then');
        if (suite.hasOwnProperty('beforeEach')) {
            suite.beforeEach(test);
        }
        Object.keys(test)
          .filter(key => key.match(reg))
          .forEach(key => {
              this.dispatchEvent('test:step', spec, title, key, parameters);
              test[key](parameters, this.logs);
          });

    }

    testSuite () {
        Object.keys(suites).forEach((spec) => {
            let total = 0;
            let success = 0;
            this.dispatchEvent('suite:start', spec);
            Object.keys(suites[spec])
              .filter(key => ['beforeEach'].indexOf(key) === -1)
              .forEach((title) => {
                  let iterations = suites[spec][title].hasOwnProperty('data') ?
                    suites[spec][title].data : [null];

                  iterations.forEach(parameters => {
                      total++;
                      try {
                          this.dispatchEvent('test:start', spec, title, parameters);

                          this.test(spec, title, parameters);
                          success++;

                          this.dispatchEvent('test:success', spec, title, parameters);
                      } catch (e) {
                          console.warn(e);

                          this.dispatchEvent('test:fail', spec, title, parameters, e);
                      }
                  });

              });
            this.dispatchEvent('suite:end', spec, { total, success });
        });
    }

    notifyLog (args) {
        this.logs.push(args);
    }
};
