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

giftRoutes.put("/:id", (req, res) => {
  try {
    const updatedGifts = Gift.update(
      {
        gift_name: req.body.event_name,
        price: req.body.price_limit,
        gift_link: req.body.event_date,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );
    if (!updatedGifts) {
      res.status(500).json("Something went wrong");
    }
    // TODO: redirect to user dashboard which will now show an updated wishlist
    res.json(updatedGifts);
  } catch (err) {
    res.status(500).json(err);
  }
});

giftRoutes.post("/", (req, res) => {
  try {
    const newGift = Gift.create({
      gift_name: req.body.event_name,
      price: req.body.price_limit,
      gift_link: req.body.event_date,
      user_id: req.session.user_id,
    });

    if (!newGift) {
      res.status(500).json("Something went wrong");
    }
    // TODO: redirect to user dashboard which will now show an updated wishlist
    res.json(newGift);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = giftRoutes;
