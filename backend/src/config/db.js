const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'e_utilities_cost',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mariadb',
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

module.exports = sequelize;