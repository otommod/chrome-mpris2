const cloneRecursive = (elm, prev) => {
    if (!elm || !elm.prototype)
        return prev || {};
    let obj = Object.getOwnPropertyNames(elm.prototype)
      .reduce((acc, cur) => {
            let type;
            try {
                type = typeof elm[cur];
                if (type === 'undefined')
                    type = typeof elm.prototype[cur];
            } catch (e) {
            }
            if (type && type === 'function')
                acc[cur] = () => {
                    acc.calls[cur] = acc.calls[cur] ? ++acc.calls[cur] : 1;
                    return null;
                };
            else
                acc[cur] = null;
            return acc;
        }
        , prev || {});
    if (elm.__proto__) {
        obj = cloneRecursive(elm.__proto__, obj);
    }
    return obj;
};

const mock = (elm, override) => {
    let obj = cloneRecursive(elm);
    obj.calls = {};
    obj.hasBeenCalled = function (method) {
        return this.calls[method] > 0;
    };
    Object.assign(obj, override);
    return obj;
};
