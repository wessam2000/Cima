const TvShow = require("../model/tvShowModel");

exports.getTvShow = async (req, res, next) => {
  try {
   
    const totalResults = await TvShow.find().countDocuments();
    console.log("pagination===> ", req.pagination);
    const { currentPage, skip, pageLimit } = req.pagination;
    const sorting = req.sorting;
    const tvShow = await TvShow.find().sort(sorting).skip(skip).limit(pageLimit);
    // const currentPage = Number(req.query.numberPage) || 1;

    res.status(200).json({
      status: "success",
      results: tvShow.length, /// length of the tvShows array
      totalResults: totalResults,
      currentPage: currentPage,
      totalPages: Math.ceil(totalResults / pageLimit),
      data: {
        tvShows: tvShow,
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