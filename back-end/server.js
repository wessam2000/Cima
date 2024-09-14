const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const Movie = require("./model/movieModel");
const DB = process.env.DB.replace("<db_password>", process.env.DB_PASS);
// mongoose.connect(DB).then(() => {
//   console.log("DB connected");
// });

// async function createOne() {
//   await Movie.create({ name: "Ahmed", age: 29, email: "AhmedRakha@gmail.com" });
// }
// createOne();

const PORT = process.env.PORT || 5000;

// console.log(process.env);

const Start = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connected")
    app.listen(PORT, () => console.log(`server is listening ${PORT} `));
  } catch (error) {
    console.error("could not connect to database", error);
  }
};
Start();