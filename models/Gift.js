const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class Gift extends Model {}

Gift.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    gift_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      // JQ: I think adding a price to a wishlist item shouldn't be required
      allowNull: true,
      // TODO: validate if integer
    },
    gift_link: {
      type: DataTypes.STRING,
      // JQ: I think adding a link to a wishlist item shouldn't be required
      allowNull: true,
      // TODO: validate if url
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "gift",
  }
);

module.exports = Gift;
