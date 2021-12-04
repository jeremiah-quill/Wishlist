const { User } = require("../models");

const userdata = [
  {
    email: "user1@gmail.com",
    password: "abc123",
  },
  {
    email: "user2@gmail.com",
    password: "abc123",
  },
  {
    email: "user3@gmail.com",
    password: "abc123",
  },
];

const seedUsers = () => User.bulkCreate(userdata);

module.exports = seedUsers;
