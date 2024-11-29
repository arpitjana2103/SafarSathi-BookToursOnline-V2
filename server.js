const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Handellling Uncaught Exceptions
process.on("uncaughtException", function (err) {
    console.log("UNHUNDELED EXCEPTION :: SHUTTING DOWN THE SERVER");
    console.log(err);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

// CONNECT WITH DATABASE
// const DB_PASSWORD = process.env.DATABASE_PASSWORD;
// const DB = process.env.DATABASE.replace("<db_password>", DB_PASSWORD);
const DB_LOCAL = process.env.DATABASE_LOCAL;

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    console.log("⌛ Connecting to Database...");
    // Connect with DataBase
    mongoose
        .connect(DB_LOCAL)
        .then(function () {
            console.log("✅ Database Connection Successfull.");
            console.log(`🔗 API URL : http://127.0.0.1:${port}/`);
        })
        .catch(function (err) {
            console.log("(ノಠ益ಠ)ノ Database Connection Failed.");
            console.log(err);
        });
});

// Handlling Unhandled Promess Rejections
process.on("unhandledRejection", function (err) {
    console.log("UNHUNDELED REJECTION :: SHUTTING DOWN THE SERVER");
    console.log(err);
    // Shutting down gracefully.
    server.close(function () {
        process.exit(1);
    });
});
