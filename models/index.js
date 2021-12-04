const User = require("./User.js");
const Gift = require("./Gift.js");
const Group = require("./Group.js");

User.hasMany(Gift, {
  foreignKey: "user_id",
});

User.belongsToMany(Group, { through: "User_Groups" });

Group.belongsToMany(User, { through: "User_Groups" });

module.exports = { User, Gift, Group };
