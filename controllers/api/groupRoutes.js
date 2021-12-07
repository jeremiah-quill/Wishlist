const groupRoutes = require("express").Router();
const { Group, User, UserGroup } = require("../../models");

// Use for testing what groups have been created
groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll({ include: [{ model: User }] });
  res.json(groupData);
});

// Create a new group.  Pass in the creating user as user_id, and they will be added as the first group member
// TODO: add auth middleware
groupRoutes.post("/", (req, res) => {
  Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: req.body.event_date,
    // TODO: change below to pass user_id from session variable
    creator_id: req.body.user_id,
  }).then((group) => {
    UserGroup.create({
      group_id: group.id,
      // TODO: change below to pass user_id from session variable
      user_id: req.body.user_id,
    })
      .then((usergroup) => {
        // TODO: add a redirect, maybe to the new group page?
        res.status(200).json(usergroup);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// add a user to a group
// TODO: add auth middleware
groupRoutes.put("/:id/add", (req, res) => {
  UserGroup.create({
    // TODO: change below to pass user_id from session variable
    user_id: req.body.user_id,
    group_id: req.params.id,
  }).then((group) => {
    res.json(group);
  });
});

// update group details
// TODO: add auth middleware
groupRoutes.put("/:id", (req, res) => {
  Group.update(
    {
      event_name: req.body.event_name,
      price_limit: req.body.price_limit,
      event_date: req.body.event_date,
    },
    {
      where: {
        id: req.params.id,
        // TODO: change below to come from session user_id variable rather than body
        creator_id: req.body.creator_id,
      },
    }
  )
    .then(() => {
      res.json("testing");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = groupRoutes;
