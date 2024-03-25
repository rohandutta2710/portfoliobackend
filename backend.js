const express = require('express');
const app = express();
const path = require("path")
const fs = require("fs")
const uuid = require('uuid');
const bodyParser = require("body-parser")
const ports = process.env.PORT || 10000;
var nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const cors = require('cors')
// middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: "*",
    method: ['Get']
}
))
dotenv.config();

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.Email_ID,
        pass: process.env.Email_Pass
    }
});

const filePath = "./database.json";
let jsonData = fs.readFileSync(filePath, "utf-8");
jsonData = JSON.parse(jsonData);

app.get("/:api", (req, res) => {
    if (req.params.api === "rdxcontact") {
        res.json(jsonData);
    }
    else {
        res.status(404).send("Error 404")
    }
})

let date = new Date();
app.post("/contact", (req, res) => {
    let data = { ...req.query, date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` };
    var mailOptions = {
        from: process.env.Email_ID,
        to: data.email+",rohandutta27102000@gmail.com",
        subject: 'Get in Touch with Rohan!',
        html: "<p>Hi "+data.name+", <br/><br/>Our support team will connect you soon. Request you to check your mailbox regularly for further updates."+
        "<br/><br/><b>Request ID:-</b>"+uuid.v4() +"<br/><b>Your message:-<br/></b> "+data.message +"<br/><br/>Thanks,<br/>RDX Team</p>"
    };
    // console.log(data);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.sendFile(path.join(__dirname, './failureemail.html'));
        } else {
            res.sendFile(path.join(__dirname, './successmail.html'));
        }
    });
    // res.send("<h1> Response is saved. Rohan Dutta will reach you asap.<br><a href='http://localhost:3000/'>Back to page</a></h1>");
})
app.listen(ports, "localhost", () => {
    console.log("Server is running.")
})