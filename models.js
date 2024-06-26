const sequelize = require("./db");
const {DataTypes} = require("sequelize");

const UserTe = sequelize.define('userte',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
        chatId: {type: DataTypes.STRING, unique: true},
        right: {type: DataTypes.INTEGER, defaultValue: 0},
        wrong: {type: DataTypes.INTEGER, defaultValue: 0},
    }
    )

module.exports = UserTe


