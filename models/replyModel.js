const mongoose = require("mongoose");
/////////////
const replySchema = new mongoose.Schema({
  body: {
    type: String,
    max: [30, "Your reply should be at least 30 characters"],
  },

  comment: { type: mongoose.Schema.ObjectId, ref: "Comment" },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
});
/////////
const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
