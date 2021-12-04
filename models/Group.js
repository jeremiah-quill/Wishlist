const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class Group extends Model {}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price_limit: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      // TODO: validate if integer
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "group",
  }
);

module.exports = Group;
