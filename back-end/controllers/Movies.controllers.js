const fs = require("fs");
const path = require("path");
const Movie = require("./../model/movieModel");
const { SourceTextModule } = require("vm");
const APISetting = require("../util/APISetting");
const TvShow = require("../model/tvShowModel");
const Actors = require("../model/actorsModel");
const Series = require("../model/seriesModel");

// const moviesData = fs.readFileSync(
//   path.join(__dirname, "..", "data", "MoviesData.json"),
//   "utf-8"
// );
// exports.validateId = (req, res, next, val) => {
//   const movieId = val;
//   const movies = JSON.parse(moviesData);
//   const movieIndex = movies.findIndex((movie) => movie.id === +movieId);
//   if (movieIndex === -1) {
//     return res.status("404").json({
//       status: "fail",
//       message: "Movie not found",
//     });
//   }
//   console.log(movieId);
//   req.movie = movies[movieIndex];
//   next();
// };

exports.Pagination = (req, res, next) => {
  const { numberPage, limit } = req.query;
  const currentPage = Number(numberPage) || 1;
  const pageLimit = Number(limit) || 6;
  if (pageLimit > 10) pageLimit = 10;
  const skip = (Number(numberPage) - 1) * Number(limit) || 1;
  req.pagination = { currentPage, skip, pageLimit };
  next();
};
exports.Sorting = (req, res, next) => {
  const sorting = req.query.sort || "vote_average";
  const order = req.query.order == "desc" ? -1 : 1 || 1;
  req.sorting = { [sorting]: order };
  next();
};
exports.getMovies = async (req, res, next) => {
  try {
    // const movie = await Movie.find().skip(skip).limit(reqQuery.limit);///// pagination
    // console.log(movie)
    // numberPage-1 * limit
    //////////////////SORTING////////////////////////////
    // sort({field:acen/decn})
    // const movie = await Movie.find().sort({"vote_average":-1}).limit(2);
    // const movie = await Movie.find().sort("-vote_average");
    // const reqQuery = req.query;
    // const currentPage = Number(reqQuery.numberPage) || 1;
    // const limit = Number(reqQuery.limit) || 6;
    // if (limit > 10) limit = 10;
    // const skip = (Number(reqQuery.numberPage) - 1) * Number(reqQuery.limit) || 1;
    // const sort = reqQuery.sort || "-vote_average";

    // const apiSetting = new APISetting(Movie.find(), req.query).pagination().sorting().select();
    // console.log("APISetting",apiSetting)
    // const movie = await apiSetting.query;
    // console.log("movie", movie)
    // console.log("======> ",totalResults)

    // let reqQuery = JSON.stringify(req.query)
    // reqQuery = reqQuery.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(reqQuery))

    const totalResults = await Movie.find().countDocuments();
    console.log("pagination===> ", req.pagination);
    const { currentPage, skip, pageLimit } = req.pagination;
    const sorting = req.sorting;
    const movie = await Movie.find().sort(sorting).skip(skip).limit(pageLimit);
    // const currentPage = Number(req.query.numberPage) || 1;

    res.status(200).json({
      status: "success",
      results: movie.length, /// length of the movies array
      totalResults: totalResults,
      currentPage: currentPage,
      totalPages: Math.ceil(totalResults / pageLimit),
      data: {
        movies: movie,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.status("200").json({
        status: "success",
        data: movie,
      });
    } else {
      res.status(404).json({
        status: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      msg: err,
    });
  }
};
exports.addMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(200).json({
      status: "success",
      data: { newMovie },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      msg: err,
    });
  }
};
exports.updateMovie = async (req, res, next) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updateMovie) {
      return res.status(200).json({
        status: "success",
        data: { updateMovie },
      });
    }
    return res.status(404).json({
      status: "not found",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getTopFive = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      results: req.topFive.length,
      data: { topFive: req.topFive },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      msg: error,
    });
  }
};
