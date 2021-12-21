const router = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../models");

// Renders dashboard with logged in user info
router.get("/dashboard", async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Gift },
        { model: Group, attributes: { exclude: ["group_password"] } },
      ],
    });
    if (!userData) {
      res.status(500).json();
      return;
    }

    const user = userData.get({ plain: true });

    res.render("userDashboard", {
      ...user,
      logged_in: true,
      style: "user-dashboard.css",
    });
  } catch (err) {
    res.status(400).json();
  }
});

// Renders user profile details page of logged in user
router.get("/dashboard/profile", async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    // checks if any data came back from DB 
    if (!userData) {
      res.status(500).json({ message: "Could not find user" });
      return;
    }

    const user = userData.get({ plain: true });

    res.render("userProfile", {
      ...user,
      logged_in: true,
      style: "user-dashboard.css",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render group dashboard with all group details
// When accessing group page from user dashboard :group_id param will come from href on each group link
// When accessing group page for the first time after joining group :group_id param will come from form data
router.get("/group/:group_id", async (req, res) => {
  try {
    const groupData = await Group.findByPk(req.params.group_id, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [{ model: Gift }],
        },
      ],
    });

    // Check if any data came back from DB
    if (!groupData) {
      req.flash("error_messages", "cannot find group")
      res.status(500).json();
      return;
    }
    
    // Check if logged in user is a member of group
    const group = groupData.get({ plain: true });
    const userIds = group.users.map((user) => user.id);
    if (userIds.indexOf(req.session.user_id) === -1) {
      req.flash("error_messages", "You are not a member of this group")
      res.status(500).json();
      return;
    }

    // find the current user in the current group
    const user = group.users.find((user) => user.id === req.session.user_id);

    // find the secret santa this user has to buy a gift for, and also include their gifts (somehow we can access .usergroup.assigned_user...how can we access without using .usergroup?)
    const assignedUserData = await User.findByPk(user.usergroup.assigned_user, {
      include: [{ model: Gift }],
    });

    // if user has no secret santa (group creator hasn't drawn names yet), that property will be set to null.  Otherwise we want the secret santa data
    let assignedUser;
    if (assignedUserData) {
      assignedUser = assignedUserData.get({ plain: true });
    } else {
      assignedUser = null;
    }

    // check to see if current user is group creator
    let isCreator = false;
    if (group.creator_id === req.session.user_id) {
      isCreator = true;
    }

    res.render("groupDashboard", {
      isCreator,
      assigned_user: assignedUser,
      ...group,
      logged_in: true,
      style: "group-dashboard.css",
    });
  } catch (err) {
    req.flash("error_messages", "something went wrong")
    res.status(500).json(err);
  }
});

// render signup page
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signUp", { style: "sign-up.css" });
});

// render login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login", { style: "login.css" });
});

// render join group page
router.get("/join-group", (req, res) => {
  res.render("joinGroup", { style: "group-join.css" });
});

// render homepage
router.get("/", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("homePage", { style: "landing-page.css" });
});

// render create group form
router.get("/create-group", (req, res) => {
  res.render("createGroup", { style: "create-group.css" });
});

module.exports = router;
