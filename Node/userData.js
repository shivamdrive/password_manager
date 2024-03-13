const mongoose = require("mongoose");

const userData = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: String,
    email: { type: String, unique: true },
    password: String,
    webData: [
      {
        applicationName: String,
        userName: String,
        applicationPassword: String,
      },
    ],
  },
  {
    collection: "userInfo",
  }
);

mongoose.model("userInfo", userData);
