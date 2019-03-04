
class Assertable {
    constructor (obj) {
        this.actual = obj;

        this.to = this;
        this.be = this;
        this.of = this;
        this.type = new TypeAssertable(obj);
    }

    equal (expected) {
        if (this.actual === expected)
            return this;
        throw new AssertError(expected, this.actual);
    }

    null () {
        if (this.actual === null)
            return this;
        throw new AssertError(null, this.actual);
    }
}

class TypeAssertable {
    constructor (obj) {
        this.actual = obj;
    }

    /**
     *
     * @returns {ArrayAssertable}
     */
    array () {
        if (typeof this.actual === 'object' && this.actual instanceof Array)
            return new ArrayAssertable(this.actual);
        throw new TypeAssertError([], this.actual);
    }

    /**
     *
     * @returns {StringAssertable}
     */
    string () {
        if (typeof this.actual === 'string' || this.actual instanceof String)
            return new StringAssertable(this.actual);
        throw new TypeAssertError('', this.actual);
    }

    /**
     *
     * @returns {NumberAssertable}
     */
    number () {
        if (typeof this.actual === 'number' || this.actual instanceof Number)
            return new NumberAssertable(this.actual);
        throw new TypeAssertError('', this.actual);
    }

    /**
     *
     * @returns {BooleanAssertable}
     */
    boolean () {
        if (typeof this.actual === 'boolean' || this.actual instanceof Boolean)
            return new BooleanAssertable(this.actual);
        throw new TypeAssertError('', this.actual);
    }
}


class BooleanAssertable {
    /**
     *
     * @param {boolean} boolean
     */
    constructor (boolean) {
        this.actual = boolean;

        this.and = this;
        this.is = this;
    }

    equals (obj) {
        if (this.actual === obj)
            return this;
        throw new AssertError(obj, this.actual);
    }

    true () {
        if (this.actual === true)
            return this;

        throw new AssertError(true, this.actual);
    }

    false () {
        if (this.actual === false)
            return this;
        throw new AssertError(false, this.actual);
    }

}

class StringAssertable {
    /**
     *
     * @param {string} string
     */
    constructor (string) {
        this.actual = string;

        this.and = this;
        this.a = this;
        this.an = this;
    }

    /**
     *
     * @param {*} obj
     * @returns {StringAssertable}
     */
    equals (obj) {
        if (this.actual === obj)
            return this;
        throw new AssertError(obj, this.actual);
    }

    /**
     *
     * @returns {StringAssertable}
     */
    URL () {
        try {
            new URL(this.actual);
            return this;
        } catch (e) {
            throw new TypeAssertError(URL, this.actual);
        }
    }

}

class NumberAssertable {
    /**
     *
     * @param {number} number
     */
    constructor (number) {
        this.actual = number;

        this.and = this;
    }

    equals (expected) {
        if (this.actual === expected)
            return this;
        throw new AssertError(expected, this.actual);
    }

}

class ArrayAssertable {
    /**
     *
     * @param {Array} array
     */
    constructor (array) {
        this.actual = array;

        this.with = this;
        this.and = this;
    }

    /**
     *
     * @param {number} size
     * @returns {ArrayAssertable}
     */
    length (size) {
        if (this.actual.length === size) {
            return this;
        }
        throw new AssertError(size, this.actual.length);
    }

    /**
     *
     * @param item
     * @returns {ArrayAssertable}
     */
    contains (item) {
        if (this.actual.includes(item)) {
            return this;
        }
        throw new AssertError([item], this.actual);
    }

}
