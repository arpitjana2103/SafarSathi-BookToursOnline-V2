const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const { app } = require("./app");

// CONNECT WITH DATABASE
// const DB_PASSWORD = process.env.DATABASE_PASSWORD;
// const DB = process.env.DATABASE.replace("<db_password>", DB_PASSWORD);
const DB_LOCAL = process.env.DATABASE_LOCAL;

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`🔗 API URL  : http://127.0.0.1:${port}/`);
    console.log("⌛(•_•)⌛...Connecting to Database...");
});

// Connect with DataBase
mongoose
    .connect(DB_LOCAL)
    .then(function () {
        console.log("✅ Database Connection Successfull.");
    })
    .catch(function (err) {
        console.log("(ノಠ益ಠ)ノ Database Connection Failed.");
        console.log(err);
    });
