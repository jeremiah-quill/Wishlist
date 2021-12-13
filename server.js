const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
// const helpers = require("./utils/helpers");
const { Group, User } = require("./models");
const sendReminderEmail = require("./utils/sendReminderEmail.js");
let cron = require("node-cron");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({});

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

app.use(routes);

app.get("*", function (req, res) {
  res.status(404).render("404", {
    page_title: "Sorry!",
  });
});

// at noon every day check to see if any group event date is 7 days out.  If it is, send a reminder to anyone in those groups has reminders turned on
cron.schedule("* 12 * * *", async () => {
  const groupsData = await Group.findAll({ include: [{ model: User }] });

  const groups = groupsData.map((group) => {
    return group.get({ plain: true });
  });

  // get every group that needs a reminder
  const groupsNeedingReminder = groups.filter((group) => {
    let currentDate = new Date();
    let sevenDaysFromNow = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    let eventDate = new Date(group.event_date);

    // compare date seven days from now to date of event.  If it's the same day it will be added to groupsNeedingReminder
    if (sevenDaysFromNow.toDateString() === eventDate.toDateString()) {
      return group;
    }
  });

  // send an email to every user who chose to get a reminder
  groupsNeedingReminder.forEach((group) => {
    group.users.forEach((user) => {
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
