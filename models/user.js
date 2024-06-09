import { sequelize, DataTypes } from "./model.js";
const User = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    no_telepon: DataTypes.STRING
});
export default User;