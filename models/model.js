import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize("challengerein", "root", "", {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00'
});
export { sequelize, DataTypes };