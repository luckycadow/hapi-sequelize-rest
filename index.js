'use strict';

const RouteBuilder = require('./lib/routeBuilder');

const defaultOptions = {
    prefix: '/',
    readOnly: false
};

exports.register = (server, options, next) => {

    options = Object.assign(defaultOptions, options);
    const models = server.plugins['hapi-sequelize'].db.sequelize.models;

    Object.keys(models).filter((modelName) => {

        return modelName.toLowerCase() === models[modelName].options.name.singular;
    }).forEach((modelName) => {

        const model = models[modelName];

        RouteBuilder.list(server, options, model);
        RouteBuilder.get(server, options, model);

        if (!options.readOnly) {
            RouteBuilder.create(server, options, model);
            RouteBuilder.update(server, options, model);
            RouteBuilder.delete(server, options, model);
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
