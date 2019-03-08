class AssertError extends Error {
    constructor (expected, actual, ssf) {
        super(`Expected ${expected} but got ${actual}`);

        this.expected = expected;
        this.actual = actual;

        this.name = 'AssertError';
        this.html = this.buildError();
        // capture stack trace
        ssf = ssf || AssertError;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, ssf);
    }

    buildError () {
        return `Expected 
        <span class="type expected">${this.expected !== null ? this.expected.constructor.name : this.expected}</span>
        <span class="value this.expected">${JSON.stringify(this.expected)}</span>
        <br>&nbsp;but got 
        <span class="type actual">${this.actual !== null ? this.actual.constructor.name : this.actual}</span>
        <span class="value this.actual">${JSON.stringify(this.actual)}</span>`;
    }
}

class TypeAssertError extends AssertError {
    constructor (expected, actual, ssf) {
        super(expected, actual, ssf);

        this.name = 'TypeAssertError';
        this.html = `Expected <span class="type expected">${expected.constructor.name}</span><br>to be of type <span class="type actual">${actual.constructor.name}</span>`;
    }
}
