'use strict';

const Joi = require('joi');

const getJoiType = module.exports.getJoiType = (type) => {

    let schema;

    switch (type.key) {
        case 'CHAR':
        case 'STRING':
            schema = Joi.string().max(type._length).allow('');
            break;
        case 'TEXT':
        case 'TINYTEXT':
        case 'MEDIUMTEXT':
        case 'LONGTEXT':
            schema = Joi.string().allow('');
            break;
        case 'NUMBER':
        case 'DECIMAL':
        case 'DOUBLE':
        case 'FLOAT':
        case 'REAL':
            schema = Joi.number();
            break;
        case 'INTEGER':
        case 'BIGINT':
            schema = Joi.number().integer();
            break;
        case 'BOOLEAN':
            schema = Joi.boolean();
            break;
        case 'DATE':
            schema = Joi.date('YYYY-MM-DDTHH:mm:ssZ');
            break;
        case 'DATEONLY':
            schema = Joi.date('YYYY-MM-DD');
            break;
        case 'TIME':
            schema = Joi.date('HH:mm:ss');
            break;
        case 'ARRAY':
            schema = Joi.array().items(getJoiType(type.type));
            break;
        default:
            schema = Joi.string().allow('');
    }

    // We have to define null as empty or response objects wouldn't be valid
    // request payloads.  We don't want that.

    return schema.empty(null);
};

module.exports.id = (model) => {

    const keyAttribute = Object.keys(model.attributes).map((key) => {

        return model.attributes[key];
    }).find((attribute) => {

        return attribute.primaryKey;
    });


    if (keyAttribute) {
        return getJoiType(keyAttribute.type).required();
    }
}

module.exports.list = (model) => {

    const schema = {};
    Object.keys(model.attributes).forEach((key) => {

        schema[key] = getJoiType(model.attributes[key].type);
    });

    schema.limit = Joi.number().integer().min(1).max(100).default(25);
    schema.offset = Joi.number().integer().positive().default(0);

    return Joi.object(schema).unknown(false);
};

module.exports.create = (model) => {

    const schema = {};
    Object.keys(model.attributes).forEach((key) => {

        const field = model.attributes[key];

        schema[key] = getJoiType(field.type);
        if (field.primaryKey) {
            schema[key] = schema[key].forbidden();
        } else if (field.allowNulls === false) {
            schema[key] = schema[key].required();
        }
    });

    return Joi.object(schema).unknown(false);
};

module.exports.update = (model) => {

    const schema = {};
    Object.keys(model.attributes).forEach((key) => {

        const field = model.attributes[key];

        schema[key] = getJoiType(field.type);
        if (field.primaryKey || field.allowNulls === false) {
            schema[key] = schema[key].required();
        }
    });

    return Joi.object(schema).unknown(false);
};
