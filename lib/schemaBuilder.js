const Joi = require('joi');

module.exports.list = (model) => {

    let schema = {};
    Object.keys(model.attributes).forEach((key) => {

        schema[key] = getJoiType(model.attributes[key]);
    });

    schema.limit = Joi.number().integer().min(1).max(100).default(25);
    schema.offset = Joi.number().integer().positive().default(0);

    return Joi.object(schema).unknown(false);
}

module.exports.create = (model) => {

    let schema = {};
    Object.keys(model.attributes).forEach((key) => {

        let field = model.attributes[key];

        schema[key] = getJoiType(field);
        if (field.primaryKey) {
            schema[key] = schema[key].forbidden();
        } else if (field.allowNulls === false) {
            schema[key] = schema[key].required();
        }
    });

    return Joi.object(schema).unknown(false);
}

module.exports.update = (model) => {

    let schema = {};
    Object.keys(model.attributes).forEach((key) => {

        let field = model.attributes[key];

        schema[key] = getJoiType(field.type);
        if (field.primaryKey || field.allowNulls === false) {
            schema[key] = schema[key].required();
        }
    });

    return Joi.object(schema).unknown(false);
}

function getJoiType(type) {

    let joiType;

    switch(type.key) {
        case 'CHAR':
        case 'STRING':
            joiType = Joi.string().length(type._length);
            break;
        case 'TEXT':
        case 'TINYTEXT':
        case 'MEDIUMTEXT':
        case 'LONGTEXT':
            joiType = Joi.string();
            break;
        case 'NUMBER':
        case 'DECIMAL':
        case 'DOUBLE':
        case 'FLOAT':
        case 'REAL':
            joiType = Joi.number();
            break;
        case 'INTEGER':
        case 'BIGINT':
            joiType = Joi.number().integer();
            break;
        case 'BOOLEAN':
            joiType = Joi.boolean();
            break;
        case 'DATE':
        case 'TIME':
        case 'DATEONLY':
            joiType = Joi.date();
            break;
        case 'ARRAY':
            joiType = Joi.array().items(getJoiType(type.type));
            break;
        default:
            joiType = Joi.object();
            break;
    }

    return joiType;
}
