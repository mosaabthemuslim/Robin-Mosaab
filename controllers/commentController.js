const factory = require("./handlerFactory");
const Comment = require("../models/commentModel");
//////////
exports.createComment = factory.creatOne(Comment);
exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
