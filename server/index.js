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

// app.use('/uploads',express.static('uploads'));

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
require("./routes/upload")(app);
require("./routes/groupChat")(app);

app.listen(4000, () => {
    console.log("Backend server is running!");
});
