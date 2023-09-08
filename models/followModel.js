const mongoose = require("mongoose");
const User = require("./userModel");
//////////

const followShcema = new mongoose.Schema({
  following: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "To follow someane you should have his id"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A following should belong to a user"],
  },
});
////////////////////
followShcema.index({ following: 1 }, { unique: true });
followShcema.statics.calcFollow = async function (userId) {
  // calculating the number of followers and following
  const following = await this.countDocuments({ user: userId });
  const followers = await this.countDocuments({ following: userId });
  console.log(following, followers);
  await User.findByIdAndUpdate({ _id: userId }, { numFollowing: following });
  await User.findByIdAndUpdate({ _id: userId }, { numFollowers: followers });
};

followShcema.post("save", function () {
  // calling it with the follower and the user bieng followed to update the counter and bouth sides
  this.constructor.calcFollow(this.user);
  this.constructor.calcFollow(this.following);
});
followShcema.pre(/^findOneAnd/, async function (next) {
  // finding the document on update and on delete
  this.f = await this.model.findOne(this.getQuery());
  next();
});
followShcema.post(/^findOneAnd/, async function () {
  // calling it again in bouth sides user and the user bieng followed
  await this.f.constructor.calcFollow(this.f.user);
  await this.f.constructor.calcFollow(this.f.following);
  // console.log("ON DELETE");
});
/////////////////
const Follow = mongoose.model("Follow", followShcema);
module.exports = Follow;
