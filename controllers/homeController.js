const Post = require("./../models/postModel");

const factory = require("./handlerFactory");
exports.home = factory.getAll(Post);
