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

// get single gift by id to add to modal
giftRoutes.get("/:id", async (req, res) => {
  try {
    const giftData = await Gift.findByPk(req.params.id);
    if (!giftData) {
      req.flash("error_messages", "Failed to get item details");
      res.status(500).json();
    }

    const { gift_name, price, gift_link, id } = giftData;
    res.status(200).json({ gift_name, price, gift_link, id });
  } catch (err) {
    req.flash("error_messages", "Failed to get item details");
    res.status(500).json();
  }
});

// update a gift by id
giftRoutes.put("/:id", async (req, res) => {
  try {
    // TODO: test if I need this
    let price = req.body.price;
    if (price === "") {
      price = null;
    }

    const updatedGifts = await Gift.update(
      {
        gift_name: req.body.gift_name,
        price,
        gift_link: req.body.gift_link,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );
    if (!updatedGifts) {
      req.flash("error_messages", "Failed to update gift in wishlist.");
      res.status(500).json();
      return
    }
    req.flash("success_messages", "Updated gift in wishlist");
    res.status(200).json(updatedGifts);
  } catch (err) {
    req.flash("error_messages", "Failed to update gift in wishlist.");
    res.status(500).json();
  }
});

// add a gift
giftRoutes.post("/", async (req, res) => {
  try {
    // TODO: test if I need this
    let price = req.body.price;
    if (price === "") {
      price = null;
    }

    const newGift = await Gift.create({
      gift_name: req.body.gift_name,
      price,
      gift_link: req.body.gift_link,
      user_id: req.session.user_id,
    });

    if (!newGift) {
      req.flash("error_messages", "Failed to add gift to wishlist.");
      res.status(500).json();
    }
    req.flash("success_messages", "Added gift to wishlist");
    res.status(200).json();
  } catch (err) {
    req.flash("error_messages", "Failed to add gift to wishlist");
    res.status(500).json();
  }
});

// delete a gift
giftRoutes.delete("/:id", async (req, res) => {
  try {
    const giftData = await Gift.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!giftData) {
      req.flash('error_messages', "Could not delete gift")
      res.status(500).json();
      return;
    }
    req.flash("success_messages", "Gift deleted from your wishlist");
    res.status(200).json();
  } catch (err) {
    req.flash('error_messages', "Could not delete gift")
    res.status(500).json();
  }
});

module.exports = giftRoutes;