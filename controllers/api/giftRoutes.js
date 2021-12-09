const giftRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// get all gifts for testing
giftRoutes.get("/", (req, res) => {
  try {
    const giftsData = Gift.findAll();

    if (!giftsData) {
      res.status(500).json("Can't find gifts in database");
      return;
    }
    res.json(giftsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userRoutes;
