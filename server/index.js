const express = require("express");
const app = express();
app.use(express.static(__dirname + '/public/images'));
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
mongoose.connect(
    db.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Connected to MongoDB");
    }
);

require("./routes/auth")(app);
require("./routes/conversation")(app);
require("./routes/message")(app);

app.listen(8080, () => {
    console.log("Backend server is running!");
});
