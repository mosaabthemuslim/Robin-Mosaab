const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
///////////////////////////
// get the user with the id
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id })
    .populate({
      // populate the following
      path: "followingUser",
      // populating the user bieng followed
      populate: {
        path: "following",

        select: "name",
      },
    })
    .populate({
      // populating the followers field
      path: "followers",
      // populating the user that is following the current user
      populate: {
        path: "user",
        select: "name",
      },
    });

  res.status(200).json({
    status: "seccess",
    user,
  });
});
