const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/connection.js");

// Set up sessions with cookies
const sess = {
  secret: "something to change",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

// Need these middlewares above routes or they won't work in routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// JQ NOTE: needs to be below app initialization to connect the middleware to app
app.use(session(sess));

const routes = require("./controllers");
app.use(routes);

// Set Handlebars as the default template engine.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Sets up the Express app to handle data parsing

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
