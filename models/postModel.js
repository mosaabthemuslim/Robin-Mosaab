const mongoose = require("mongoose");

///////////////////

const postShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post should have a title"],
      max: [
        10,
        "The title of the post should be equal or less than 10 characters",
      ],
    },
    post: {
      type: String,
      max: [400, "The post should be equal or less than 400 characters"],
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },

    numComments: {
      type: Number,
      default: 0,
    },
    createdAt: Date,
    editedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
////////////////////////
//create a virtual property for that contains all the comments
postShema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
postShema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  // ismodified
  if (this.isModified) {
    this.editedAt = Date.now;
  }
  next();
});
const Post = mongoose.model("Post", postShema);
module.exports = Post;
