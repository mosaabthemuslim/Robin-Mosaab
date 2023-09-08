const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("./../controllers/userController");
const followController = require("./../controllers/followontroller");
////////////////////////

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.use(authController.protect);
router.route("/logout").get(authController.logout);
router.route("/updateMe").patch(authController.updateMe);
router.route("/updatePassword").patch(authController.updatePassword);
router.route("/forgotPassword").post(authController.fotgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/deleteMe").patch(authController.deleteMe);
router.route("/getMe").get(userController.getMe);
router.route("/followUser").post(followController.followUser);
router
  .route("/followUser/:id")
  .get(followController.getFollow)
  .delete(followController.deletFollow);

///////////////

module.exports = router;
