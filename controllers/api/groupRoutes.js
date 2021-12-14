const groupRoutes = require("express").Router();
const { Group, User, UserGroup } = require("../../models");
const sendReminderEmail = require("../../utils/sendReminderEmail.js");

// Get all groups (for testing)
groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll({ include: [{ model: User }] });
  res.json(groupData);
});

// Create a new group.  Pass in the creating user as user_id, and they will be added as the first group member
// TODO: TEST
// Posts form data from ".....".  FE logic in "....."
// req.body includes event_name, price_limit, event_date, group password, and is_get_reminder
groupRoutes.post("/", (req, res) => {
  Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: req.body.event_date,
    creator_id: req.session.user_id,
    group_password: req.body.group_password,
  }).then((group) => {
    // Create association between user and group.  We set is_get_reminder based on checkbox in form
    UserGroup.create({
      group_id: group.id,
      user_id: req.session.user_id,
      is_get_reminder: req.body.is_get_reminder,
    })
      // TODO: do we need below?
      .then((usergroup) => {
        res.render("");
        res.status(200).json(usergroup);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// TODO: add auth middleware, create a uuid to use instead of the group_id
// Add a user to a group
// Posts form data from views/joinGroup.handlebars.  FE logic in public/js/joinGroup.js
// req.body includes group_id, group_password, and is_get_reminder
groupRoutes.post("/join", async (req, res) => {
  try {
    const groupData = await Group.findOne({
      where: { id: req.body.group_id },
      include: [{ model: User }],
    });
    if (!groupData) {
      res.status(400).json({ message: "Cannot find group with this ID" });
      return;
    }
    // Check if user is already a member of the group
    const userIds = groupData.users.map((user) => user.id);
    if (userIds.indexOf(req.session.user_id) !== -1) {
      res
        .status(500)
        .json({ message: "You are already a member of this group" });
      return;
    }

    // Check if user gave the correct group password
    const validPassword = groupData.checkPassword(req.body.group_password);
    if (!validPassword) {
      res.status(500).json({ message: "Incorrect group password" });
      return;
    }

    const group = groupData.get({ plain: true });
    // Create association between user and group.  is_get_reminder is a boolean telling us if this user chose to receive a reminder email for this group
    UserGroup.create({
      user_id: req.session.user_id,
      group_id: groupData.id,
      is_get_reminder: req.body.is_get_reminder,
    }).then(() => {
      // redirect to the newly joined group page.  Eventually rendered in groupDashboard.handlebars
      res.status(200).redirect(`/group/${req.body.group_id}`);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// WARNING: this is not ready
// add a user to a group given they are not logged in, they just need a link with /api/groups/:id/join
// TODO: add auth middleware, implement link sharer api instead of using /:id/join as url for route
// groupRoutes.post("/:id/join", (req, res) => {
//   User.create({
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password,
//   }).then((user) => {
//     UserGroup.create({
//       user_id: user.id,
//       group_id: req.params.id,
//     }).then(() => {
//       res.json("user created and added to group");
//     });
//   });
// });

// update group details
// TODO: add auth middleware, test
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
