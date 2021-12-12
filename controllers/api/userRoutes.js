const userRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// url at this point is: /api/users
userRoutes.get("/", async (req, res) => {
  const usersData = await User.findAll();
  res.json(usersData);
});

// create a new user
// READ TO TEST
userRoutes.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// login for existing user
// READ TO TEST
userRoutes.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res.status(500).json({ message: "Could not find email" });
      return;
    }

    // uses instance method to check if password provided matches user password
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(500).json({ message: "Incorrect password" });
      return;
    }

    // Once user logs in, set up the sessions variable 'loggedIn'
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_In = true;
      res.status(200).json({
        user: userData,
        message: "You are now logged in!",
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a user's email or password
userRoutes.put("/profile", async (req, res) => {
  try {
    const userData = await User.update(
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        where: {
          user_id: req.session.user_id,
        },
      }
    );
    console.log(userData);
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update a user's password
userRoutes.put("/password", async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id);
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password, please try again" });
      return;
    }
    const updatedUserData = await User.update(
      { password: req.body.password },
      {
        where: {
          user_id: req.session.user_id,
        },
      }
    );
    console.log(updatedUserData);
    res.status(200).json(updatedUserData);
  } catch (err) {
    console.log(err);
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
