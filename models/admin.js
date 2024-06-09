import { sequelize, DataTypes } from "./model.js";
const Admin = sequelize.define('admins', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
});
export default Admin;