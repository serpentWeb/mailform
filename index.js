const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

const https = require('https');
const fs = require('fs');

var key = fs.readFileSync(__dirname + '/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

app.get('/', (req, res) => {
   res.send('Now using https..');
});

var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

class MainController {
  static async sendEmail(req, res) {
    const { name, phoneNumber } = req.query;

    if (!name || !phoneNumber) {
      res.statusCode = 500;
      res.send("validation error");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "cecoproaudit@gmail.com",
        pass: "31021983cepia",
      },
    });

    const mailOptions = {
      from: "cecoproaudit@gmail.com",
      to: "general@c-ecopro.ru",
      subject: `Заявка с сайта от ${name}`,
      text: `Имя: ${name}, \n Контактный номер: ${phoneNumber}`,
    };

    try {
      const response = await transporter.sendMail(mailOptions);

      if(response.response.includes('OK')) {
        res.statusCode = 200;
        const message = "Email successfully sent";
        res.status(200).send({ message });
        return
      }

      res.status(500).send({ error });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
}

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
app.get("/sendEmail", MainController.sendEmail);
