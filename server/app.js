const path = require("path");
const express = require("express");
const Mail = require("./model/mail");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const debug = require("debug")("node-angular");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/images", express.static(path.join("images")));
app.use("/", express.static(path.join(__dirname, "jersam")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

const imagePath = path.join(__dirname, "/images");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "jersamgb@gmail.com",
    clientId:
      "713513589622-415fkr13nqoedbg92htkotlsht1ogc2m.apps.googleusercontent.com",
    clientSecret: "dAYc9RxXuymrOUhddVhwBPHX",
    refreshToken:
      "1//04JamQGav3hjcCgYIARAAGAQSNwF-L9IrSF_hyWIk6TPv4GKkN8m5eSXy16Nmjj00TVJ3IZqwqWWwHt_vccGv_MTc3BfDmK_T-qQ",
    accessToken:
      "ya29.a0AfH6SMAhE5sRSTKS4CqcW_hXTiRknbXWNhXgAV35VJ0XDMrgQW5S1QTeW9_wmVpp_ZlKp8Q-4n4_vR8gD0X-f3tueOKL4ttkV49cA_hde_3NLtrbTvv9vXUI79Ls1WSlFfWcPkTgn9HUaoqLGxFuySPZmB-Pa69sNNg",
  },
});

// SUBSCRIBER
app.post("/api/sendMail", (req, res, next) => {
  const mail = new Mail({
    ...req.body,
  });

  mail.save(mail).then((document) => {
    res.status(201).json({
      message: "successfully saved!!",
      data: true,
    });
  });
});

// CONTACT US
app.post("/api/sendMailiMessage", (req, res, next) => {
  const mailOptions = {
    from: req.body.email,
    to: "JerSam Hotel <jersamgb@gmail.com>",
    subject: req.body.subject,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.status(200).json({
        message: error,
        data: false,
      });
    } else {
      if (response.response) {
        res.status(201).json({
          message: "successfully saved!!",
          data: true,
        });
      }
    }
  });
});

// SEND BOOKING CONFIRMATION TO EMAIL
function saveBookingDetails(req, res) {
  const mailOptions = {
    from: "JerSam Hotel <jersamgb@gmail.com>",
    to: req.body.booking.to,
    subject: req.body.booking.subject,
    html: req.body.booking.body,
    attachments: [
      {
        filename: "room.jpg",
        path: imagePath + "/room.jpg",
      },
      {
        filename: "room_2.jpg",
        path: imagePath + "/room_2.jpg",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log("response with error", error);
      res.status(200).json({
        message: error,
        data: false,
      });
    } else {
      if (response.response) {
        console.log("response successful", response.response);
        res.status(200).json({
          message: response.response,
          data: true,
        });
      }
    }
  });
}

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "jersam", "index.html"))
// })

module.exports = app;
