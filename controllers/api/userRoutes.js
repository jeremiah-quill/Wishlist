const userRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// url at this point is: /api/users

//create a new user
userRoutes.post("/", async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body_username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// login for existing user
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

// Gets user by id and includes associated gifts and groups
userRoutes.get("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      // JQ NOTE: changed below to include model Group instead of model UserGroup.  Sequelize knows about the User/Group association from models/index.js where we are telling it to configure UserGroup as the association model.
      include: [{ model: Gift }, { model: Group }],
    });
    if (!userData) {
      res.json("User does not exist");
      return;
    }
    // TODO: change below to res.render
    res.status(200).json(userData);
  } catch {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = userRoutes;