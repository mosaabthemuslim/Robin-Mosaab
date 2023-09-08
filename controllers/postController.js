const Post = require("./../models/postModel");

const factory = require("./handlerFactory");
/////////////////////////

exports.createPost = factory.creatOne(Post);
exports.getPost = factory.getOne(Post, {
  path: "comments",
  populate: { path: "replies" },
});
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
