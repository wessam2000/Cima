const Actors = require("../model/actorsModel");

exports.getActors = async (req, res, next) => {
  try {
    
    const totalResults = await Actors.find().countDocuments();
    console.log("pagination===> ", req.pagination);
    const { currentPage, skip, pageLimit } = req.pagination;
    const sorting = req.sorting;
    const actor = await Actors.find().sort(sorting).skip(skip).limit(pageLimit);
    // const currentPage = Number(req.query.numberPage) || 1;

    res.status(200).json({
      status: "success",
      results: actor.length, /// length of the actors array
      totalResults: totalResults,
      currentPage: currentPage,
      totalPages: Math.ceil(totalResults / pageLimit),
      data: {
        actors: actor,
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