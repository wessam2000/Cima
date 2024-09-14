const mongoose = require("mongoose");
const { Schema } = mongoose;
// mongoose.Schema
const seriesSchema = new Schema({
  _id: Schema.Types.ObjectId ,
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [Number],
  id: Number,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  title: String,
  video: Boolean,
  vote_average: Number,
  homepage: String,
  vote_count: Number,
});

const Series = mongoose.model("Series", seriesSchema);
module.exports = Series;
// const m = new Movie();
// m.save()
