require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const db = require("./config/db");
const paypal = require("./config/paypal");
const port = process.env.PORT || 8000;
const route = require("./routes");
const firebase = require('firebase');
const storage = require('firebase/storage');

db.connect(process.env.DB_URL);
paypal.connect(process.env.ID_Client,process.env.Secret)
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const firebaseConfig = {
  apiKey: "AIzaSyD2VdQK_UHd1cIt0czBjre1O9iFRlwQtXg",
  authDomain: "ec-2021-afe88.firebaseapp.com",
  projectId: "ec-2021-afe88",
  storageBucket: "ec-2021-afe88.appspot.com",
  messagingSenderId: "782658869306",
  appId: "1:782658869306:web:92f250452c738db1973d03",
  measurementId: "G-69H3F7G54F"
};
firebase.initializeApp(firebaseConfig);
const ref = firebase.storage().ref();


route(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost`, port);
});
