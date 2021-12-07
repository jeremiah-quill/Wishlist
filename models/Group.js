const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class Group extends Model {
  checkPassword(userPw) {
    // ADDED THIS TO TEST ROUTE
    if (userPw === this.group_password) {
      return true;
    } else {
      return false;
    }
    // COMMENTED THIS OUT TO TEST ROUTE
    // return bcrypt.compareSync(userPw, this.group_password);
    //
  }
}

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
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_password: {
      type: DataTypes.STRING,
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
