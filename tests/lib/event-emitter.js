class EventEmitter {
    constructor () {
        this.listeners = {};
    }

    on () {
        return this.addEventListener(...arguments);
    }

    addEventListener (type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
        return this;
    }

    removeEventListener (type, callback) {
        if (!(type in this.listeners)) {
            return;
        }
        let stack = this.listeners[type];

        if (stack.indexOf(callback) !== -1)
            stack.splice(stack.indexOf(callback), 1);
    }

    dispatchEvent (type, ...data) {
        let event = new Event(type);
        if (!(event.type in this.listeners)) {
            return true;
        }
        let stack = this.listeners[event.type].slice();
        stack.forEach(each => {
            each.call(this, ...data);
        });
        return !event.defaultPrevented;
    }

};
