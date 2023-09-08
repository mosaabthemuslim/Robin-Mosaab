const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// returning results
const sendResult = (res, statusCode, doc) => {
  res.status(statusCode).json({
    status: "seccess",
    doc,
  });
};
// creating one document
exports.creatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;

    const doc = await Model.create(req.body);
    sendResult(res, 200, doc);
  });
// read one document
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let doc;
    // if there is a populate populate the field
    if (populateOptions) {
      doc = await Model.find({ _id: req.params.id }).populate(populateOptions);
    } else {
      doc = await Model.find({ _id: req.params.id });
    }
    // if there is no document return an error
    if (!doc)
      return next(new AppError("There is no document with that ID"), 404);
    sendResult(res, 200, doc);
  });
// update on that has the user id and find it by it id in the params
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      { user: req.user._id, _id: req.params.id },
      req.body
    );
    sendResult(res, 200, doc);
  });
// delete one that has the id of the user and find it by the its id in the params
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete({
      user: req.user._id,
      _id: req.params.id,
    });
    sendResult(res, 204, doc);
  });
// get all results
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find(req.query);

    sendResult(res, 200, doc);
  });
