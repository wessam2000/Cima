const express = require("express");
const cookieParser =require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(cors());
const moviesRouter = require("./routes/movies.route");
const usersRouter = require("./routes/users.route");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/series", moviesRouter);
app.use("/api/v1/tvShows", moviesRouter);
app.use("/api/v1/actors", moviesRouter);
app.use("/api/v1/users",usersRouter );

module.exports=app
