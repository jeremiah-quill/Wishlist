const userRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// Get all users (for testing)
userRoutes.get("/", async (req, res) => {
  const usersData = await User.findAll();
  res.json(usersData);
});

// Create a new user
userRoutes.post("/", async (req, res) => {
  try {
    // Check if email is already in use.  If it is, warn user and don't create anything in the DB
    const emailData = await User.findOne({
      where: { email: req.body.email },
    });
    if (emailData) {
      req.flash("error_messages", "Email already in use");
      res.status(500).json();
      return;
    }

    // Check if username is already in use.  If it is, warn user and don't create anything in the DB
    const usernameData = await User.findOne({
      where: { username: req.body.username },
    });
    if (usernameData) {
      req.flash("error_messages", "Username already in use");
      res.status(500).json();
      return;
    }

    // Create new user in DB
    const userData = await User.create(req.body);

    if (!userData) {
      req.flash("error_messages", "Failed to create user");
      res.status(500).json();
    }

    req.flash("success_messages", "Account created");

    // Configure session data
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json();
    });
  } catch (err) {
    req.flash("error_messages", "Failed to create account");
    res.status(500).json();
  }
});

// login existing user
userRoutes.post("/login", async (req, res) => {
  try {
    // Check if username is in DB.  If it isn't, warn user and keep them at login screen
    const userData = await User.findOne({
      where: { username: req.body.username },
    });
    if (!userData) {
      req.flash("error_messages", "Could not find username");
      res.status(500).json();
      return;
    }

    // Check if password matches password in DB.  If it doesn't, warn user and keep them at login screen
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      req.flash("error_messages", "Incorrect password");
      res.status(500).json();
      return;
    }
    req.flash("success_messages", "Logged in");

    // Configure session data
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json();
    });
  } catch (err) {
    req.flash("error_messages", "Failed to login");
    res.status(500).json();
  }
});

// Update a user's email or username
userRoutes.put("/profile", async (req, res) => {
  try {
    const userData = await User.update(
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        where: {
          id: req.session.user_id,
        },
      }
    );
    console.log(userData);
    req.flash("success_messages", "Successfully updated account info");
    res.status(200).json(userData);
  } catch (err) {
    req.flash("error_messages", "Failed to Update username or email");
    res.status(500).json(err);
  }
});

// Update a user's password
userRoutes.put("/password", async (req, res) => {
  try {
    // checks user's hashed password again current password input
    const userData = await User.findByPk(req.session.user_id);
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      req.flash("error_messages", "Wrong current password, please try again");
      res
        .status(400)
        .json({ message: "Wrong current password, please try again" });
      return;
    }
    // if current password is correct will update a user's password to new input
    const updatedUserData = await User.update(
      { password: req.body.new_password },
      {
        where: {
          id: req.session.user_id,
        },
        // allows use of beforeUpdate hook for user model
        individualHooks: true,
      }
    );
    req.flash("success_messages", "Successfully updated password");
    res.status(200).json(updatedUserData);
  } catch (err) {
    req.flash("error_messages", "Failed to Password");
    res.status(500).json(err);
  }
});

// logout user
userRoutes.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = userRoutes;
