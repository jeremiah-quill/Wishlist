const userRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// url at this point is: /api/users

// create a new user
userRoutes.post("/", async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // COMMENTED OUT BELOW TO TEST ROUTE
    // req.session.save(() => {
    //   req.session.user_id = userData.id;
    //   req.session.loggedIn = true;
    //   res.status(200).json(userData);
    // });
    // res.json(userData); // ADDED FOR TESTING ROUT
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// login for existing user
// TODO: TEST
userRoutes.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // uses instance method to check if password provided matches user password
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Once user logs in, set up the sessions variable 'loggedIn'
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.status(200).json({
        user: userData,
        message: "Welcome back, you are now logged in!",
      });
    });
  } catch {
    console.log(err);
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
    const userData = await User.findByPk(req.session.user_id)
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect password, please try again" });
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

module.exports = userRoutes;
