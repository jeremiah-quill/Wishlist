const groupRoutes = require("express").Router();
const express = require("express");
const { Group, User, UserGroup } = require("../../models");

// Use for testing what groups have been created
groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll({ include: [{ model: User }] });
  res.json(groupData);
});

// Get group by id and include all group members
groupRoutes.get("/:id", async (req, res) => {
  try {
    const groupData = await Group.findByPk(req.params.id, {
      include: [{ model: User }],
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

// Create a new group.  Pass in the creating user as user_id, and they will be added as the first group member
groupRoutes.post("/", (req, res) => {
  // req.body will look like:
  // {
  //   "event_name": "event_name",
  //   "price_limit": 10,
  //   "event_date": "1/1/22",
  //   "user_id": 1
  // }
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
        // TODO: add a redirect
        res.status(200).json(usergroup);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// add a user to a group
groupRoutes.put("/:id/add", (req, res) => {
  UserGroup.create({
    user_id: req.body.user_id,
    group_id: req.params.id,
  }).then((group) => {
    res.json(group);
  });
});

// update group details
groupRoutes.put("/:id", (req, res) => {
  // update group details based on req.body
  Group.update(
    {
      event_name: req.body.event_name,
      price_limit: req.body.price_limit,
      event_date: req.body.event_date,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    // if there is a user_id passed into req.body, then create a new relationship between the user_id and the group_id
    res.json("testing");
  });
});

module.exports = groupRoutes;
