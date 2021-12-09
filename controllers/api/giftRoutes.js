const giftRoutes = require("express").Router();
const { Group, User, UserGroup, Gift } = require("../../models");

// get all gifts for testing
giftRoutes.get("/", (req, res) => {
  try {
    const giftsData = Gift.findAll();

    if (!giftsData) {
      res.status(500).json("Can't find gifts in database");
      return;
    }
    res.json(giftsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

giftRoutes.put("/:id", (req, res) => {});

giftRoutes.delete("/:id", async (req, res) => {
  try {
    const giftdata = await Gift.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!giftdata) {
      res.status(404).json({ message: "No gift found with this id!" });
      return;
    }

    res.status(200).json(giftdata);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = giftRoutes;
