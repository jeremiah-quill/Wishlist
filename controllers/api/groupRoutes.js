const groupRoutes = require("express").Router();
const { Group, User, UserGroup } = require("../../models");
const {shuffle, assignSantas} = require('../../utils/drawRandom')

// Get all groups (for testing)
groupRoutes.get("/", async (req, res) => {
  const groupData = await Group.findAll({ include: [{ model: User }] });
  res.json(groupData);
});

// TODO: add auth middleware
// Create a new group and add current user as group member.  Set creator_id property in group to be current user
groupRoutes.post("/", async (req, res) => {
  // HACK: ADD 5 HOURS SINCE SEQUELIZE STORES IS UTC/GMT
  let newDate = new Date(
    new Date(req.body.event_date).getTime() + 5 * (60 * 60 * 1000)
  );

try {
  const newGroup = await Group.create({
    event_name: req.body.event_name,
    price_limit: req.body.price_limit,
    event_date: newDate,
    creator_id: req.session.user_id,
    group_password: req.body.group_password,
  })
  if(!newGroup) {
    req.flash('error_messages', "************ Something went wrong in groupRoutes *****")
    res.status(500).json();
    return
  }
  
  // add current user as group member
  const newGroupAssociation = await UserGroup.create({
    group_id: newGroup.id,
    user_id: req.session.user_id,
    is_get_reminder: req.body.is_get_reminder,
  })
  if(!newGroupAssociation) {
    req.flash('error_messages', "************ Something went wrong in groupRoutes *****")
    res.status(500).json(err);
    return
  }

  req.flash('success_messages', "You have successfully created a group.")
  res.status(200).json({group_id: newGroup.id})

} catch(err) {
req.flash('error_messages', "************ Something went wrong in groupRoutes")
res.status(500).json(err);
}
});

// TODO: add auth middleware
// Add an existing user to a group
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

    const newGroupAssociation = await UserGroup.create({
      user_id: req.session.user_id,
      group_id: groupData.id,
      is_get_reminder: req.body.is_get_reminder,
    })
    if(!newGroupAssociation) {
      req.flash("error_messages", "Something went wrong");
      res.status(500).json("something went wrong");
      return
    }
    // handle success
    req.flash("success_messages", "Joined group");
    res.status(200).json("successfully joined group");

  } catch (err) {
    req.flash("error_messages", "Failed to join group");
    res.status(500).json();
  }
});

// randomnly draw secret santas
groupRoutes.put("/:group_id/assign-santas", async (req, res) => {
  const groupMembersData = await Group.findByPk(req.params.group_id, {
    include: [{ model: User }],
  });

  const memberIds = groupMembersData.users.map((user) => user.id);

// shuffle is a function that shuffles an array, assignSantas then uses that shuffled array to assign secret santas
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

  req.flash("success_messages", "Secret santas have been assigned");
  res.json(santas);
});

// TODO: add auth middleware
// update group details (only renders on group dashboard for the creator)
groupRoutes.put("/:id", async (req, res) => {
  // HACK: ADD 5 HOURS SINCE SEQUELIZE STORES IS UTC/GMT
  let newDate = new Date(
    new Date(req.body.event_date).getTime() + 5 * (60 * 60 * 1000)
  );

  try {
    const updatedGroup = await Group.update({
      event_name: req.body.event_name,
      price_limit: req.body.price_limit,
      event_date: newDate,}, {
        where: {
          id: req.params.id,
          // TODO: change below to come from session user_id variable rather than body
          creator_id: req.session.user_id,
        },
      });

      if(!updatedGroup) {
        req.flash("error_messages", "Failed to update group");
        res.status(500).json("Failed to update group");
      }
      req.flash("success_messages", "Group details updated");
      res.status(200).json("group updated");
  } catch(err) {
    req.flash("error_messages", "Failed to update group");
    res.status(500).json("Failed to update group");
  }
});

module.exports = groupRoutes;
