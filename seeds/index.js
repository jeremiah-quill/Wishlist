const seedUsers = require("./userData");
const seedGifts = require("./giftData");
const seedGroups = require("./groupData");
const seedUserGroups = require("./userGroupData");

const sequelize = require("../config/connection.js");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");

  await seedUsers();
  console.log("\n----- USERS SEEDED -----\n");

  await seedGifts();
  console.log("\n----- GIFTS SEEDED -----\n");

  await seedGroups();
  console.log("\n----- GROUPS SEEDED -----\n");

  await seedUserGroups();
  console.log("\n----- USERGROUPS SEEDED -----\n");

  process.exit(0);
};

seedAll();
