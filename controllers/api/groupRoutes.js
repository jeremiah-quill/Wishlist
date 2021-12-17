const groupRoutes = require("express").Router();
const { Group, User, UserGroup } = require("../../models");
const sendReminderEmail = require("../../utils/sendReminderEmail.js");

// Get all groups (for testing)
groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll({ include: [{ model: User }] });
  res.json(groupData);
});

groupRoutes.get("/:group_id", async (req, res) => {
  const groupData = await Group.findByPk(req.params.group_id, {
    include: [{ model: User, attributes: { exclude: ["password"] } }],
  });
  res.json(groupData);
});

// Create a new group.  Pass in the creating user as user_id, and they will be added as the first group member
// Posts form data from ".....".  FE logic in "....."
// req.body includes event_name, price_limit, event_date, group password, and is_get_reminder
groupRoutes.post("/", (req, res) => {
  // HACK: ADD 5 HOURS SINCE SEQUELIZE STORES IS UTC/GMT
  let newDate = new Date(
    new Date(req.body.event_date).getTime() + 5 * (60 * 60 * 1000)
  );

  Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: newDate,
    creator_id: req.session.user_id,
    group_password: req.body.group_password,
  }).then((group) => {
    // Create association between user and group.  We set is_get_reminder based on checkbox in form
    UserGroup.create({
      group_id: group.id,
      user_id: req.session.user_id,
      is_get_reminder: req.body.is_get_reminder,
    })
      .then(() => {
        req.flash("success_messages", "Group created");

        res.status(200).json({ group_id: group.id });
      })
      .catch((err) => {
        req.flash("error_messages", "Failed to create group");

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
    const groupData = await Group.findByPk(req.body.group_id, {
      include: [{ model: User }],
    });
    if (!groupData) {
      req.flash("error_messages", "Cannot find group with this ID");

      res.status(400).json({ message: "Cannot find group with this ID" });
      return;
    }
    // Check if user is already a member of the group
    const userIds = groupData.users.map((user) => user.id);
    if (userIds.indexOf(req.session.user_id) !== -1) {
      req.flash("error_messages", "You are already a member of this group");

      res
        .status(500)
        .json({ message: "You are already a member of this group" });
      return;
    }

    // Check if user gave the correct group password
    const validPassword = groupData.checkPassword(req.body.group_password);
    if (!validPassword) {
      req.flash("error_messages", "Incorrect group password");

      res.status(500).json({ message: "Incorrect group password" });
      return;
    }

    const group = groupData.get({ plain: true });
    // Create association between user and group.  is_get_reminder is a boolean telling us if this user chose to receive a reminder email for this group
    UserGroup.create({
      user_id: req.session.user_id,
      group_id: groupData.id,
      is_get_reminder: req.body.is_get_reminder,
      // TODO: remove this, and add it to logic for when we draw names
      // assigned_user: 1,
    }).then(() => {
      // redirect to the newly joined group page.  Eventually rendered in groupDashboard.handlebars
      req.flash("success_messages", "Joined group");

      res.status(200).json("successfully joined group");
      // redirect(`/group/${req.body.group_id}`);
    });
  } catch (err) {
    req.flash("error_messages", "Failed to join group");

    res.status(500).json(err);
  }
});

groupRoutes.put("/:group_id/assign-santas", async (req, res) => {
  const groupMembersData = await Group.findByPk(req.params.group_id, {
    include: [{ model: User }],
    // exclude passwords
  });

  const memberIds = groupMembersData.users.map((user) => user.id);

  // Fisher-Yates shuffle algorithm
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const assignSantas = (array) => {
    let santas = [];

    for (let i = 0; i < array.length; i++) {
      let newSanta = {};

      if (i !== array.length - 1) {
        newSanta.user_id = array[i];
        newSanta.assignment_id = array[i + 1];
        /*   newSanta[array[i]] = array[i+1]
         */ santas.push(newSanta);
      } else {
        newSanta.user_id = array[i];
        newSanta.assignment_id = array[0];

        /* newSanta[array[i]] = array[0] */
        santas.push(newSanta);
      }
    }
    return santas;
  };

  let santas = assignSantas(shuffle(memberIds));

  santas.forEach((santa) => {
    UserGroup.update(
      {
        assigned_user: santa.assignment_id,
      },
      {
        where: {
          user_id: santa.user_id,
        },
      }
    );
  });

  // const updatedSantaData = UserGroup.update()
  req.flash("success_messages", "Secret santas have been assigned");

  res.json(santas);

  // res.json(members);
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
        creator_id: req.session.user_id,
      },
    }
  )
    .then(() => {
      req.flash("success_messages", "Group details updated");

      res.status(200).json("group updated");
    })
    .catch((err) => {
      req.flash("error_messages", "Failed to update group");
      res.status(500).json("Failed to update group");
    });
});

module.exports = groupRoutes;
