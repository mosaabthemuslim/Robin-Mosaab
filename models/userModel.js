const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

///////////////

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please give us your Name"],
    },
    email: {
      type: String,
      required: [true, "Please give us youe email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },
    password: {
      type: String,
      min: [10, "Your password should be at least 10 caracters"],
      required: [true, "Please provide a password"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide a passwordConfirm"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    numFollowers: {
      type: Number,
      default: 0,
    },
    numFollowing: {
      type: Number,
      default: 0,
    },
    passwordChangeAt: Date,
    resetToken: String,
    resetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
///////////////////////
userSchema.virtual("followers", {
  ref: "Follow",
  foreignField: "following",
  localField: "_id",
});
userSchema.virtual("followingUser", {
  ref: "Follow",
  foreignField: "user",
  localField: "_id",
});
///////////////////

///////////////////
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.createResetToken = function () {
  // create the reset token
  token = crypto.randomBytes(32).toString("hex");
  // saving the hashed token to the DB for comparing it later
  this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetExpires = Date.now() + 10 * 60 * 1000;
  // returning the not hashed token to be send to the user
  return token;
};
// Hashing the password in database so if there was a hacker, it won't know what is the password
userSchema.pre("save", async function (next) {
  // hashing the password if the password is modified or if the document is new
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }

  this.email = this.email.toLowerCase();
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now();
  next();
});
// Comparing the hashed password  in the database with the one the user will provide when it will log in
userSchema.methods.comparePasswords = async function (
  inputPassword,
  theDBPassword
) {
  return await bcrypt.compare(inputPassword, theDBPassword);
};
userSchema.methods.checkIfPasswordChanged = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const timeStamp = this.passwordChangeAt.getTime / 1000;
    return JWTTimeStamp < timeStamp;
  }
  return false;
};
/////////////////
const User = mongoose.model("User", userSchema);
module.exports = User;
