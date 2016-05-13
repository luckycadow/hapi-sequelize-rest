'use strict';

const Path = require('path');
const SchemaBuilder = require('./schemaBuilder');

module.exports.list = (server, options, model) => {

    const path = Path.join(options.prefix, model.options.name.plural);

    server.route({
        method: 'GET',
        path: path,
        handler: (request, reply) => {

            const limit = request.query.limit;
            const offset = request.query.offset;

            const where = Object.assign({}, request.query);
            delete where.limit;
            delete where.offset;

            model.findAll({
                limit,
                offset,
                where
            }).then(reply, reply);
        },
        config: {
            validate: {
                query: SchemaBuilder.list(model, options)
            }
        }
    });
};

module.exports.create = (server, options, model) => {

    const path = Path.join(options.prefix, model.options.name.plural);

    server.route({
        method: 'POST',
        path: path,
        handler: (request, reply) => {

            model.create(request.body).then(reply, reply);
        },
        config: {
            validate: {
                payload: SchemaBuilder.create(model)
            }
        }
    });
};

module.exports.get = (server, options, model) => {

    const path = Path.join(options.prefix, model.options.name.plural);

    server.route({
        method: 'GET',
        path: `${path}/{id}`,
        handler: (request, reply) => {

            const id = Number.parseInt(request.params.id);
            model.findById(id).then((instance) => {

                reply(instance || Boom.notFound());
            }, reply);
        }
    });
};

module.exports.update = (server, options, model) => {

    const path = Path.join(options.prefix, model.options.name.plural);

    server.route({
        method: 'PUT',
        path: `${path}/{id}`,
        handler: (request, reply) => {

            model.update(request.body).then((result) => {

                result[0] ? reply() : reply(Boom.notFound());
            }, reply);
        },
        config: {
            validate: {
                payload: SchemaBuilder.update(model)
            }
        }
    });
};

module.exports.delete = (server, options, model) => {

    const path = Path.join(options.prefix, model.options.name.plural);

    server.route({
        method: 'DELETE',
        path: `${path}/{id}`,
        handler: (request, reply) => {

            model.destroy({
                where: {
                    id: request.params.id
                }
            }).then((count) => {

                count ? reply() : reply(Boom.notFound());
            }, reply);
        }
    });
};
