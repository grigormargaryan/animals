require('dotenv').config();

module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            host : '127.0.0.1',
            database: process.env.NODE_DB,
            user:     process.env.NODE_USER,
            password: process.env.NODE_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: process.env.NODE_DB,
            user:     process.env.NODE_USER,
            password: process.env.NODE_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: process.env.NODE_DB,
            user:     process.env.NODE_USER,
            password: process.env.NODE_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'migrations'
        }
    }

};
