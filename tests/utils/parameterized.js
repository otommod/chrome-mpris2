const replaceParameters = (title, parameters) => {
    parameters = parameters || {};
    Object.keys(parameters).forEach(each => {
        title = title.replace(new RegExp('\\$' + each, 'g'), JSON.stringify(parameters[each]));
    });
    return title;
};

const parameterized = (title, data, assertion) => {
    data.forEach(params => {
        it(
          replaceParameters(title, params),
          assertion.bind(this, params)
        );
    });
};
