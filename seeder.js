const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const path = require("path");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read JSON files
// `${__dirname}/_data/bootcamps.json`
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"), "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data", "courses.json"), "utf-8")
);
const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, "_data", "users.json"), "utf-8")
);
//Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    console.log("Data Imported ...".bgGreen.inverse);
  } catch (e) {
    console.error(e);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed!!!".red.inverse);
  } catch (e) {
    console.error(e);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}