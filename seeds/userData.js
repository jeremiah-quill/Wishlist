const { User } = require("../models");

const userdata = [
  {
    username: "user1",
    email: "user1@gmail.com",
    password: "abc123",
  },
  {
    username: "user2",
    email: "user2@gmail.com",
    password: "abc123",
  },
  {
    username: "user3",
    email: "user3@gmail.com",
    password: "abc123",
  },
];

const seedUsers = () => User.bulkCreate(userdata);

module.exports = seedUsers;
