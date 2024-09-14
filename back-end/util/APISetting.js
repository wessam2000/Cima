module.exports = class APISetting {
  constructor(_query, _queryString) {
    this.query = _query;
    this.queryString = _queryString;
  }
  pagination() {
    const { numberPage, limit } = this.queryString;
    // const currentPage = Number(numberPage) || 1;
    const pageLimit = Number(limit) || 6;
    if (pageLimit > 10) pageLimit = 10;
    const skip = (Number(numberPage) - 1) * Number(limit) || 1;
    // req.pagination = { currentPage, skip, pageLimit };
    this.query = this.query.find().skip(skip).limit(pageLimit);
    return this;
  }
  sorting() {
    const sort = this.queryString.sort || "-vote_average";
    this.query = this.query.sort(sort);
    // req.sorting = sort;
    return this;
  }
  select() {
    const fields = this.queryString.fields || "-vote_average";
    this.query = this.query.select(fields);
    return this;
  }
 
    // filter() {
    //     const reqQuery = { ...this.queryString }; // Directly copy the query object
    
    //     // Replace gt, lt, gte, lte with their MongoDB operator equivalents
    //     Object.keys(reqQuery).forEach((key) => {
    //         if (typeof reqQuery[key] === 'object') {
    //             Object.keys(reqQuery[key]).forEach((operator) => {
    //                 if (['gt', 'lt', 'gte', 'lte'].includes(operator)) {
    //                     reqQuery[key][`$${operator}`] = reqQuery[key][operator];
    //                     delete reqQuery[key][operator];
    //                 }
    //             });
    //         }
    //     });
    
    //     // Exclude certain fields from the query
    //     const excludeFields = ["numberPage", "sort", "fields", "limit"];
    //     excludeFields.forEach((field) => delete reqQuery[field]);
    
    //     // Convert numeric strings to numbers
    //     Object.keys(reqQuery).forEach((key) => {
    //         if (typeof reqQuery[key] === 'object') {
    //             Object.keys(reqQuery[key]).forEach((operator) => {
    //                 let value = reqQuery[key][operator];
    //                 if (!isNaN(value)) {
    //                     reqQuery[key][operator] = Number(value);
    //                 }
    //             });
    //         }
    //     });
    
    //     console.log("==========>", reqQuery);
    //     this.query = this.query.find(reqQuery);
    //     return this;
    // }
    
};
// const movie = await Movie.find().sort(req.sorting).skip(skip).limit(pageLimit);
// const n = new APISetting(Movie.find(), req.query).pagination().sorting();

// Movie.find({ price: { $gt:50 } })
// price=50;
// price [gt] =50
