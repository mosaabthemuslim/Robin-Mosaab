const factory = require("./handlerFactory");
const Reply = require("./../models/replyModel");
//////////////////
exports.createReply = factory.creatOne(Reply);
exports.getReply = factory.getOne(Reply);
exports.updateReply = factory.updateOne(Reply);
exports.deleteReply = factory.deleteOne(Reply);
