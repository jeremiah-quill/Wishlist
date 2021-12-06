const router = require("express").Router();
const userRoutes = require("./userRoutes");
const groupRoutes = require("./groupRoutes");

router.use("/users", userRoutes);
router.use("/groups", groupRoutes);

module.exports = router;
