const suites = {};

const expect = function (obj) {
    return new Assertable(obj);
};

const exLog = console.log;
console.log = function () {
    exLog.apply(console, arguments);
    titb.notifyLog(arguments);
};

const titb = {
    logs: [],
    keywords: [
        'given',
        'and',
        'when',
        'then',
        'it',
        'should'
    ],
    test (spec, test, parameters) {

        let reg = new RegExp('(^(' + this.keywords.join('|') + ')\\W)|(^(' + this.keywords.join('|') + ')$)', 'gi');

        if (!Object.keys(test).filter(key => key.match(reg)).length)
            throw new Error('Test object needs at least one implementation of any given, when, then');
        if (spec.hasOwnProperty('beforeEach')) {
            spec.beforeEach(test);
        }
        Object.keys(test)
          .filter(key => key.match(reg))
          .forEach(key => {
              test[key](parameters, this.logs);
          });

    },
    testSuite () {
        Object.keys(suites).forEach((spec) => {
            Dom.drawSpec(spec);
            Object.keys(suites[spec])
              .filter(key => ['beforeEach'].indexOf(key) === -1)
              .forEach((test) => {
                  let iterations = suites[spec][test].hasOwnProperty('data') ?
                    suites[spec][test].data : [null];

                  iterations.forEach(parameters => {
                      try {
                          this.test(suites[spec], suites[spec][test], parameters);
                          Dom.drawTest(spec, Dom.testTitle(test, parameters));
                      } catch (e) {
                          console.warn(e);
                          Dom.drawTest(spec, Dom.testTitle(test, parameters), e);
                      }
                  });

              });
        });
    },
    notifyLog (args) {
        this.logs.push(args);
    }
};

const Dom = {
    drawSpec (title) {
        let elm = document.getElementById(title.slug());
        if (!elm) {
            elm = document.createElement('li');
            let h2 = document.createElement('h2');
            h2.innerText = title;
            elm.append(h2);
            let list = document.createElement('ol');
            list.id = title.slug();
            elm.append(list);
            document.getElementById('list').append(elm);
        }
    },
    drawTest (spec, test, error) {
        let elm = document.createElement('li');

        elm.id = `${spec.slug()}_${test.slug()}`;
        elm.innerHTML = test.replace(/\b(given|when|then|it)\b/gi, '<span class="keyword">$&</span>');
        document.getElementById(spec.slug()).append(elm);

        elm.className = error ? 'error' : 'success';
        let p = document.createElement('p');
        p.className = 'result';
        p.innerHTML = error ? (error.html || error) : '';
        elm.append(p);
    },
    /**
     *
     * @param {string} title
     * @param {Object} parameters
     */
    testTitle (title, parameters) {
        parameters = parameters || {};
        Object.keys(parameters).forEach(each => {
            title = title.replace(new RegExp('\\$' + each, 'g'), `<b>${JSON.stringify(parameters[each])}</b>`);
        });
        return title;
    }
};

String.prototype.slug = function () {
    return this.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
};
