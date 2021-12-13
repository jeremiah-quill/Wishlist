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
groupRoutes.post("/", (req, res) => {
  Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: req.body.event_date,
    creator_id: req.session.user_id,
    group_password: req.body.group_password,
  }).then((group) => {
    UserGroup.create({
      group_id: group.id,
      user_id: req.session.user_id,
    })
      .then((usergroup) => {
        res.render("");
        res.status(200).json(usergroup);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// Add a user to a group given they are already logged in.  User must provide a group id and group password in some sort of "join group" form.
// TODO: add auth middleware, create a uuid to use instead of the group_id
// READY TO TEST
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
    // Check if logged in user is already a member of the group
    const userIds = groupData.users.map((user) => user.id);
    if (userIds.indexOf(req.session.user_id) !== -1) {
      res
        .status(200)
        .json({ message: "You are already a member of this group" });
      return;
    }

    // Check if user gave the correct group password
    const validPassword = groupData.checkPassword(req.body.group_password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect group password" });
      return;
    }

    const group = groupData.get({ plain: true });

    if (!req.session.logged_in) {
      res.json({ message: "Please create an account to join a group" });
      return;
    }

    UserGroup.create({
      user_id: req.session.user_id,
      group_id: groupData.id,
      is_get_reminder: req.body.is_get_reminder,
    }).then(() => {
      res.redirect(`/group/${req.body.group_id}`, {
        ...group,
        logged_in: true,
      });

      res.status(200).json({
        group: groupData,
        message: "You have joined the group!",
      });
    });
  } catch (err) {
    console.log("err");
    res.status(400).json(err);
  }
});

// add a user to a group given they are not logged in, they just need a link with /api/groups/:id/join
// TODO: add auth middleware, implement link sharer api instead of using /:id/join as url for route
groupRoutes.post("/:id/join", (req, res) => {
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

groupRoutes.get("/reminders", async (req, res) => {
  const groupsData = await Group.findAll({
    include: [{ model: User }],
  });

  res.json(groupsData);

  // const groups = groupsData.map((group) => {
  //   return group.get({ plain: true });
  // });

  // // get every group that needs a reminder
  // const groupsNeedingReminder = groups.filter((group) => {
  //   let currentDate = new Date();
  //   let sevenDaysFromNow = new Date(
  //     currentDate.getTime() + 12 * 24 * 60 * 60 * 1000
  //   );
  //   let eventDate = new Date(group.event_date);

  //   if (sevenDaysFromNow.toDateString() === eventDate.toDateString()) {
  //     return group;
  //   }
  // });

  // // send an email to every user who chose to get a reminder
  // groupsNeedingReminder.forEach((group) => {
  //   group.users.forEach((user) => {
  //     // TODO: change conditional to test if user.getReminders is true (will have to be a checkbox option when user's sign up)
  //     if (user.id > 10) {
  //       sendReminderEmail(user.email, group.event_name);
  //     }
  //   });
  // });

  // res.json(groupsNeedingReminder);
});

module.exports = groupRoutes;
