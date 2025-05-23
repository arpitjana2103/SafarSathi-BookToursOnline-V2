const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Tour = require("./../../models/tour.model");
const Review = require("./../../models/review.model");
const User = require("./../../models/user.model");

dotenv.config({ path: "./../../config.env" });

console.log(process.env.DATABASE_PASSWORD);

// const DB_PASSWORD = process.env.DATABASE_PASSWORD;
// const DB = process.env.DATABASE.replace("<db_password>", DB_PASSWORD);
const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose.connect(DB_LOCAL).then(() => console.log("DB connection successful!"));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
