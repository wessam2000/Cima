const Series = require("../model/seriesModel");

exports.getSeries = async (req, res, next) => {
  try {
   
    const totalResults = await Series.find().countDocuments();
    console.log("pagination===> ", req.pagination);
    const { currentPage, skip, pageLimit } = req.pagination;
    const sorting = req.sorting;
    const series = await Series.find().sort(sorting).skip(skip).limit(pageLimit);
    // const currentPage = Number(req.query.numberPage) || 1;
    res.status(200).json({
      status: "success",
      results: series.length, /// length of the series array
      totalResults: totalResults,
      currentPage: currentPage,
      totalPages: Math.ceil(totalResults / pageLimit),
      data: {
        series,
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