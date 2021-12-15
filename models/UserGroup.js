const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class UserGroup extends Model {}

UserGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
        unique: false,
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "group",
        key: "id",
        unique: false,
      },
    },
    is_get_reminder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    assigned_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "usergroup",
  }
);

module.exports = UserGroup;
