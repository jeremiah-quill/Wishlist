const groupRoutes = require("express").Router();
const { Group, User } = require("../../models");

// Get group by and include all group members
groupRoutes.get("/:id", async (req, res) => {
  try {
    const groupData = await Group.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    if (!groupData) {
      res.json("Group does not exist");
      return;
    }
    res.json(groupData);
    // TODO: change below to res.render
    res.status(200).json(groupData);
  } catch (err) {
    res.status(500).json(`Could not find a group with that id`);
  }
});

groupRoutes.get("/");

module.exports = groupRoutes;
