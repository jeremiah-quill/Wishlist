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
    group_password: req.body.group_password,
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

// Add a user to a group given they are already logged in.  User must provide a group id and group password in some sort of "join group" form.
// TODO: add auth middleware, send error messages to front end?, create a uuid to use instead of the group_id
groupRoutes.put("/", async (req, res) => {
  try {
    const groupData = await Group.findOne({ where: { id: req.body.id } });

    if (!groupData) {
      res.status(400).json({ message: "Cannot find group with this ID" });
      return;
    }

    const validPassword = groupData.checkPassword(req.body.group_password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect group password" });
      return;
    }

    // TODO: user_id should come from sessions user_id variable
    UserGroup.create({
      user_id: req.body.user_id,
      group_id: groupData.id,
    }).then(() => {
      res.json("Added user to group");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// add a user to a group given they are not logged in, they just need a link with /api/groups/:id/join
// TODO: add auth middleware, implement link sharer api instead of using /:id/join as url for route
groupRoutes.put("/:id/join", (req, res) => {
  User.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }).then((user) => {
    UserGroup.create({
      user_id: user.id,
      group_id: req.params.id,
    }).then(() => {
      res.json("user created and added to group");
    });
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
