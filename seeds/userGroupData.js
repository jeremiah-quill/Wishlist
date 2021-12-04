const { UserGroup } = require("../models");

const usergroupdata = [
  {
    user_id: 1,
    group_id: 1,
  },
  {
    user_id: 1,
    group_id: 2,
  },
  {
    user_id: 2,
    group_id: 1,
  },
  {
    user_id: 3,
    group_id: 3,
  },
];

const seedUserGroups = () => UserGroup.bulkCreate(usergroupdata);

module.exports = seedUserGroups;
