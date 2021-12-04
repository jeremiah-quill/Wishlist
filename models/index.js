const User = require("./User.js");
const Gift = require("./Gift.js");
const Group = require("./Group.js");
const UserGroup = require("./UserGroup.js");

User.hasMany(Gift, {
  foreignKey: "user_id",
});

User.belongsToMany(Group, { through: UserGroup });

Group.belongsToMany(User, { through: UserGroup });

module.exports = {
  User,
  Gift,
  Group,
  UserGroup,
};
