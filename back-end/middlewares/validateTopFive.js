const Actors = require("../model/actorsModel");
const Movie = require("../model/movieModel");
const Series = require("../model/seriesModel");
const TvShow = require("../model/tvShowModel");

exports.validateTopFive = async (req, res, next) => {
  let topFive;
  const arr = ["movies", "series", "tvShows", "actors"];
  const val = req.originalUrl.split("/").find((el) => arr.includes(el));
  const check = val !== undefined;
  if (check) {
    switch (val) {
      case "movies":
        topFive = await Movie.find().sort("-vote_average").limit(5);
        break;
      case "series":
        topFive = await Series.find().sort("-vote_average").limit(5);
        break;
      case "tvShows":
        topFive = await TvShow.find().sort("-vote_average").limit(5);
        break;
      case "actors":
        topFive = await Actors.find().sort("-vote_average").limit(5);
        break;
      default:
        topFive = await Movie.find().sort("-vote_average").limit(5);
        break;
    }
  } else {
    topFive = await Movie.find().sort("-vote_average").limit(5);
    }
    
    req.topFive = topFive;
    next();
};
