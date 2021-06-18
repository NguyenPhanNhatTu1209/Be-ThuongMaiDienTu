require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const busboy = require("connect-busboy");
const app = express();
const db = require("./config/db");
const paypal = require("./config/paypal");
const port = process.env.PORT || 8000;
const route = require("./routes");

db.connect(process.env.DB_URL);
paypal.connect(process.env.ID_Client, process.env.Secret);
//app.use(express.static(path.join(__dirname, '/img')));
app.use(cors());
app.use(express.json());
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));
      const corsOptions ={
        origin: ['https://ec18b010-superhub.web.app', 'http://localhost:3000'],
        credentials: true,         
        optionSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'Origin', 
            'x-access-token', 
            'XSRF-TOKEN'
        ], 
        preflightContinue: false 
      }
app.use(cors(corsOptions));

route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost`, port);
});
