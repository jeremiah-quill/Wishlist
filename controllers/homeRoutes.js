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
      res.status(500).json({ message: "Could not find user" });
      return;
    }

    const user = userData.get({ plain: true });

    res.render("userDashboard", { ...user, logged_in: true });
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
      include: [{ model: User, attributes: { exclude: ["password"] } }],
    });

    // Check if any data came back from DB
    if (!groupData) {
      res.status(500).json({ message: "Group does not exist" });
      return;
    }

    const group = groupData.get({ plain: true });

    // Check if logged in user is a member of group
    const userIds = group.users.map((user) => user.id);
    if (userIds.indexOf(req.session.user_id) === -1) {
      res.status(500).json({ message: "You are not a member of this group" });
      return;
    }

    res.render("groupDashboard", {
      ...group,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// render signup page
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signUp");
});

// render login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

// render join group page
router.get("/join-group", (req, res) => {
  res.render("joinGroup");
});

// render homepage
router.get("/", (req, res) => {
  // If the user is already logged in, redirect the request to their dashboard
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("homePage");
});

module.exports = router;
