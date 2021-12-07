const router = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../models");

// Gets user by id and includes associated gifts and groups
router.get("/:id", async (req, res) => {
    try {
      const userData = await User.findByPk(req.params.id, {
        // JQ NOTE: changed below to include model Group instead of model UserGroup.  Sequelize knows about the User/Group association from models/index.js where we are telling it to configure UserGroup as the association model.
        include: [{ model: Gift }, { model: Group }],
      });
      if (!userData) {
        res.json("User does not exist");
        return;
      }
      // TODO: change below to res.render
      res.status(200).json(userData);
    } catch {
      console.log(err);
      res.status(500).json(err);
    }
  });

  module.exports = router;