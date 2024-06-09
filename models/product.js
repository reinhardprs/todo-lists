import { sequelize, DataTypes } from "./model.js";
const Todo = sequelize.define('to_dos', {
    todo: DataTypes.STRING,
    deadline: DataTypes.STRING
});
export default Todo;