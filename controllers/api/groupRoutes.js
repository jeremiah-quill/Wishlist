const groupRoutes = require("express").Router();
const express = require("express");
const { Group, User, UserGroup } = require("../../models");

groupRoutes.use(express.json());

groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll();
  res.json(groupData);
});

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
    // TODO: change below to res.render
    res.status(200).json(groupData);
  } catch (err) {
    res.status(500).json(`Could not find a group with that id`);
  }
});

groupRoutes.post("/", (req, res) => {
  console.log(req.body);
  Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: req.body.event_date,
  }).then((group) => {
    UserGroup.create({
      group_id: group.id,
      user_id: req.body.user_id,
    })
      .then((usergroup) => {
        res.status(200).json(usergroup);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

module.exports = groupRoutes;
