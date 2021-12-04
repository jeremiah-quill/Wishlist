const { Gift } = require("../models");

const giftdata = [
  {
    gift_name: "winter hat",
    price: 14.99,
    gift_link: "www.winterhat.com",
    user_id: 1,
  },
  {
    gift_name: "wireless phone charter",
    price: 9.99,
    gift_link: null,
    user_id: 1,
  },
  {
    gift_name: "slippers",
    price: 5.99,
    gift_link: null,
    user_id: 1,
  },
  {
    gift_name: "coffee mug",
    price: 9.99,
    gift_link: "www.coffeemug.com",
    user_id: 2,
  },
  {
    gift_name: "basketball",
    price: 29.99,
    gift_link: "www.basketball.com",
    user_id: 3,
  },
];

const seedGifts = () => Gift.bulkCreate(giftdata);

module.exports = seedGifts;
