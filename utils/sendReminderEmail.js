const nodemailer = require("nodemailer");

// email message options
const mailOptions = {
  from: "santas.wishlist.helper@gmail.com",
  to: "",
  subject: "Reminder for wishlist",
  text: "Please remember to buy a gift for your secret santa!",
};

// email transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "santas.wishlist.helper@gmail.com",
    pass: "hohoho123!",
  },
});

// send email
const sendReminderEmail = (toEmail, eventName) => {
  mailOptions.to = toEmail;
  mailOptions.text = `Your upcoming event ${eventName} is in 7 days, please remember to buy a gift for your chosen group member!`;
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendReminderEmail;
