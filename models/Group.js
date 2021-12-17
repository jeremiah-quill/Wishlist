const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");
const bcrypt = require("bcrypt");

class Group extends Model {
  checkPassword(userPw) {
    if (userPw === this.group_password) {
      return true;
    } else {
      return false;
    }
    // Using above instead of below.  Group passwords are already shared.  I think we should present the user with their group password so they don't forget it, and if we want to present it to them, we can't hash it before putting it in DB.
    // return bcrypt.compareSync(userPw, this.group_password);
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
    // hooks: {
    //   beforeCreate: async (newGroupData) => {
    //     newGroupData.group_password = await bcrypt.hash(
    //       newGroupData.group_password,
    //       15
    //     );
    //     return newGroupData;
    //   },
    // },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "group",
  }
);

module.exports = Group;
