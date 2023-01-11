const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { json } = require("express");
// const { promisify } = require("util");
// const unlinkAsync = promisify(fs.unlink);
let extension 

const app = express();
app.use(cors());

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        "file." +
          file.originalname.split(".")[file.originalname.split(".").length - 1]
      );
      
    },
  }),
}).single("user_file");


app.get("/", (req, res) => {
  res.send(process.env.PORT);
});
app.get("/sendEmail",(req,res)=>{
    res.send("hitted to sendEmail")
})

app.post("/sendEmail", upload, (req, res) => {
    extension= req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
    const msg = JSON.parse(req.body.msg);
    console.log(msg)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dcoders00@gmail.com",
      pass: "mfhnemtnjingnfkg",
    },
  });
  const mailOption = {
    from: "dcoders00@gmail.com",
    to: "tahmimaahmed22@gmail.com",
    // to: "tahmimaahmed22@gmail.com",
    subject: "Mayhem Shield contact form",
    text: `
    Hi, this is ${msg.firstName + " " + msg.lastName} 
   ${msg.message}
   contact info
   phone: ${msg.number}
   email: ${msg.email}
    `,
    attachments: [
      {
        path: `./uploads/file.${extension}`,
      },
    ],
  };
    transporter.sendMail(mailOption, (err, info) => {
     if (err) {
       console.log(err);
     } else {
       console.log("email sent " + info.response);
    //    unlinkAsync("./uploads/file.jpg");
    fs.unlink(`./uploads/file.${extension}`,function(err){
        if(err){
            res.send(err.message)
        }else{
            console.log("deleted")
        }
    })
     }
   });
  res.send("Email sent");
});

app.listen(process.env.PORT || 8000, () => {
  console.log(process.env.PORT);
});
