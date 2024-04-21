const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegabot',
    'admin',
    'adminadmin',
    {
        host: '147.45.148.20',
        port: '5432',
        dialect: "postgres"
    }
)