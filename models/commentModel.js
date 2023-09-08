const mongoose = require("mongoose");
const Post = require("./postModel");
////////////////
const comentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      max: [30, "The comment should have less or equal than 30 characters"],
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.ObjectId, ref: "Post" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//////////////////////////
// creating a property for all the replies
comentSchema.virtual("replies", {
  ref: "Reply",
  foreignField: "comment",
  localField: "_id",
});
/////////////////////////
comentSchema.statics.calcComments = async function (postId) {
  // calculating the number of all comments
  const numComments = await this.countDocuments({ post: postId });
  await Post.findByIdAndUpdate({ _id: postId }, { numComments: numComments });
};
comentSchema.post("save", function () {
  // updating the counter on save
  this.constructor.calcComments(this.post);
});
comentSchema.pre(/^findOneAnd/, async function (next) {
  // updating the counter on delete and update
  this.c = await this.model.findOne(this.getQuery());
  next();
});
comentSchema.post(/^findOneAnd/, async function () {
  // updating the counter on delete and update
  await this.c.constructor.calcComments(this.c.post);
});
/////////////////////////
const Comment = mongoose.model("Comment", comentSchema);
module.exports = Comment;
