const router = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../models");

// Gets user by id and includes associated gifts and groups
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes:{ exclude: ["password"] },
      include: [{ model: Gift }, { model: Group, attributes: { exclude: ["group_password"] } }],
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

// Get group by id and include all group members
// TODO: add auth middleware
router.get("/group/:id", async (req, res) => {
  try {
    const groupData = await Group.findByPk(req.params.id, {
      // TODO: do not include password when including user info
      attributes: { exclude: ["group_password"] },
      include: [{ model: User, attributes:{ exclude: ["password"] }}],
    });
    if (!groupData) {
      res.json("Group does not exist");
      return;
    }
    // TODO: change below to res.render so we can pass groupData to a handlebars view
    res.status(200).json(groupData);
  } catch (err) {
    res.status(500).json(`Could not find a group with that id`);
  }
});

module.exports = router;
