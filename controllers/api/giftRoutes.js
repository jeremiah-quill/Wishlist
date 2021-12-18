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
      res.status(500).json("Can't find gift with that id");
      return;
    }

    const { gift_name, price, gift_link, id } = giftData;
    res.status(200).json({ gift_name, price, gift_link, id });
  } catch (err) {
    req.flash("error_messages", "Failed to get item details");
    res.status(500).json(err);
  }
});

// update a gift by id
giftRoutes.put("/:id", (req, res) => {
  try {
    let price = req.body.price;
    if (price === "") {
      price = null;
    }

    const updatedGifts = Gift.update(
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

      res.status(500).json("Failed to update gifts");
    }
    // TODO: redirect to user dashboard which will now show an updated wishlist
    req.flash("success_messages", "Updated gift in wishlist");

    res.status(200).json(updatedGifts);
  } catch (err) {
    req.flash("error_messages", "Failed to update gift in wishlist.");

    res.status(500).json(err);
  }
});

// add a gift
giftRoutes.post("/", async (req, res) => {
  try {
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
      res.status(500).json("Failed to add gift");
    }
    req.flash("success_messages", "Added gift to wishlist");
    res.status(200).json(newGift);
  } catch (err) {
    req.flash("error_messages", "Failed to add gift to wishlist");
    res.status(500).json(err);
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
      res.status(404).json({ message: "No gift found with this id" });
      return;
    }
    req.flash("success_messages", "Gift deleted from your wishlist");

    res.status(200).json(giftData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = giftRoutes;
