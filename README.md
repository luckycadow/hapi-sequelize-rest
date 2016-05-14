# hapi-sequelize-rest

RESTful Hapi routes based on sequelize models


## Install

```bash
$ npm install hapi-sequelize-rest
```


## Usage

Register your sequelize models with [hapi-sequelize](https://github.com/danecando/hapi-sequelize)
and then register hapi-sequelize-rest.

For example, in a manifest:
```javascript
{
    plugin: {
        register: './models',
        options: {
            uri: Config.get('/database/uri')
        }
    }
},
{
    plugin: {
        register: 'hapi-sequelize-rest',
        options: {
            prefix: '/api/v1',
            readOnly: false
        }
    }
}
```


## Options

* `prefix`: You can provide a prefix for your api routes.
By default api routes will be registered against the root of your site.

* `readOnly`: Set this to a truthy value and hapi-sequelize-rest will
only register routes for GET-ing resources.

## TODO
1. Provide an option for authentication.
2. Add some tests.

## License

MIT
