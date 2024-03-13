const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors("*"));
const brycpt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const CryptoJS = require("crypto-js");

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET = "sifhbnsoienf32423849242jkldnfwnseflsnfs{}()[]knsdfadn8764j";

app.use(express.json());

const mongoUrl =
  "mongodb+srv://shivanshunayak2211:12345@cluster0.rlawo4z.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log("error while connecting to db" + e);
  });

require("./userData");
const user = mongoose.model("userInfo");

app.post("/register", async (req, res) => {
  console.log(req.body);
  // res.send({ data: "Data received" });
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await brycpt.hash(password, 10);
  try {
    const oldUser = await user.findOne({ email });
    console.log(oldUser);
    console.log(email);

    if (oldUser) {
      return res.send({ error: "User exists" });
    }
    await user.create({
      fname,
      lname,
      email,
      // password
      password: encryptedPassword,
    });
    res.send({ status: "User Successfully registered" });
  } catch (error) {
    res.send({ status: "error" });
    console.log(error);
  }
});

// app.get("/register", async (req, res) => {
//   res.send("Data received");
// });

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const userExist = await user.findOne({ email });
  if (!userExist) {
    return res.send({ status: "User not found", error: "User not found" });
  }
  if (await brycpt.compare(password, userExist.password)) {
    const token = jwt.sign({ email: userExist.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.send({ status: "ok", data: token });
    } else {
      return res.send({ error: "Error in login" });
    }
  }
  res.send({ status: "errorInvalidPassword", error: "Invalid password" });
});

app.post("/userData", async (req, res) => {
  const { token, applicationName, userName, applicationPassword } = req.body;

  const plaintext = applicationPassword;

  var encrypted = CryptoJS.AES.encrypt(
    plaintext,
    "dgfdsgdfftdgdg345678[]asfsdfsv"
  );

  // console.log("Encrypted: " + encrypted.toString());

  try {
    const user1 = jwt.verify(token, JWT_SECRET);
    const userEmail = user1.email;

    const userObj = await user.findOne({ email: userEmail });
    // console.log("worlimg");

    if (!userObj) {
      return res.send({ status: "User not found" });
    }

    const webDataObj = await user.updateOne(
      { email: userEmail },
      {
        $push: {
          webData: {
            applicationName,
            userName,
            applicationPassword: encrypted.toString(),
          },
        },
      }
    );

    // console.log(decryptedText);

    var decrypted = CryptoJS.AES.decrypt(
      encrypted,
      "dgfdsgdfftdgdg345678[]asfsdfsv"
    );
    var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // console.log("Decrypted: " + decryptedText);

    res.send({ status: "ok from backend", userObj });

    // user
    //   .findOne({ email: userEmail })
    //   .then((data) => {
    //     console.log("User found", data);
    //     data.webData.push([{ applicationName, userName, applicationPassword }]);
    //     res.send({ status: "ok", data });
    //   })
    //   .catch((error) => {
    //     res.send({ status: "error", data: error });
    //   });
  } catch (error) {}
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await user.findOne({ email });
    if (!oldUser) {
      return res.send({ status: "User does not exist" });
    }

    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      tls: { ciphers: "SSLv3", rejectUnauthorized: false },
      port: "465",
      secure: true,
      auth: {
        user: "shivanshu20472@iiitd.ac.in",
        pass: "igxsgecyheyvbasq", 
      },
    });

    var mailOptions = {
      from: "shivanshuayak2211@gmail.com",
      to: email,
      subject: "Password Reset Link",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error is comming", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await user.findOne({ _id: id });
  if (!oldUser) {
    return res.send({ status: "User does not exist" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    // res.send("Verified")
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    res.send("User not verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await user.findOne({ _id: id });
  if (!oldUser) {
    return res.send({ status: "User does not exist" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await brycpt.hash(password, 10);
    await user.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    // res.send("Password updated");
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    res.send("Something went wrong");
  }
});
