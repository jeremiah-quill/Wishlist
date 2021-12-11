const router = require("express").Router();
const userRoutes = require("./userRoutes");
const groupRoutes = require("./groupRoutes");
const giftRoutes = require("./giftRoutes");

router.use("/users", userRoutes);
router.use("/groups", groupRoutes);
router.use("/gifts", giftRoutes);

module.exports = router;
