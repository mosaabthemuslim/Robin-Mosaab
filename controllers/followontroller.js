const Follow = require("./../models/followModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
///////////////////
exports.followUser = factory.creatOne(Follow);
exports.getFollow = factory.getOne(Follow);
exports.deletFollow = factory.deleteOne(Follow);
