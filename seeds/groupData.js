const { Group } = require("../models");

const groupdata = [
  {
    event_name: "Company Secret Santa",
    price_limit: 35,
    event_date: "12/25/2021",
    creator_id: 2,
  },
  {
    event_name: "Gift swap",
    price_limit: 50,
    event_date: "12/31/2021",
    creator_id: 1,
  },
  {
    event_name: "Family gift game",
    price_limit: 50,
    event_date: "12/25/2021",
    creator_id: 3,
  },
];

const seedGroups = () => Group.bulkCreate(groupdata);

module.exports = seedGroups;
