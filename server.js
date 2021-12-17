const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const { Group, User } = require("./models");
const sendReminderEmail = require("./utils/sendReminderEmail.js");
let cron = require("node-cron");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: "mysecret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.use(routes);

app.get("*", function (req, res) {
  res.status(404).render("404", {
    page_title: "Sorry!",
  });
});

// every day at noon check to see if any group event date is 7 days out.  If it is, send a reminder to anyone in those groups who has reminders turned on
cron.schedule("0 12 * * *", async () => {
  // Get all group data and include associated users
  const groupsData = await Group.findAll({ include: [{ model: User }] });

  // Turn group data into plain data to work with it
  const groups = groupsData.map((group) => {
    return group.get({ plain: true });
  });

  // get every group that needs a reminder
  const groupsNeedingReminder = groups.filter((group) => {
    // Create a new current date object
    let currentDate = new Date();

    // Add 7 days to current date object
    let sevenDaysFromNow = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Create a new date object with each group's event date
    let eventDate = new Date(group.event_date);

    // Compare date 7 days from now to group event date
    if (sevenDaysFromNow.toDateString() === eventDate.toDateString()) {
      return group;
    }
  });

  // send an email to every user who chose to get a reminder
  groupsNeedingReminder.forEach((group) => {
    group.users.forEach((user) => {
      // within each group, check to see which user's need a reminder
      if (user.usergroup.is_get_reminder) {
        sendReminderEmail(user.email, group.event_name);
      }
    });
  });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
