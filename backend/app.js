const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
const app = express();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "angular")));

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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "green.information2022@gmail.com",
    pass: "mxkgggtkggqiqqbv",
  },
});

transporter.verify().then(console.log).catch(console.error);

app.post("/api/sendMail", (req, res, next) => {
  console.log("user contact", req.body);
  const mailOptions = {
    from: "Device Info <green.information2022@gmail.com>",
    to: req.body.to,
    subject: req.body.subject,
    html: "Hi," + " " + req.body.name + "<br/><br/>" + req.body.message,
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log("error response", error);
      res.status(200).json({
        message: error,
        data: false,
      });
    } else {
      if (response.response) {
        console.log("success response", response.response);
        res.status(201).json({
          message: "successfully saved!!",
          data: true,
        });
      }
    }
  });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

app.listen(port, function () {});
console.log("Server running at http://127.0.0.1:" + port + "/");

// module.exports = app;
