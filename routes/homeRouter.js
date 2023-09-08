const router = require("express").Router();

const homeController = require("./../controllers/homeController");
const authController = require("./../controllers/authController");
const postController = require("./../controllers/postController");
const commentController = require("./../controllers/commentController");
const replyController = require("./../controllers/replyController");
/////////////////////////////////
router.use(authController.protect);
router.route("/").get(homeController.home);
router.route("/createPost").post(postController.createPost);
router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router.route("/commentOnPost").post(commentController.createComment);
router
  .route("/commentOnPost/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);
router.route("/createReply").post(replyController.createReply);
router
  .route("/createReply/:id")
  .get(replyController.getReply)
  .patch(replyController.updateReply)
  .delete(replyController.deleteReply);
module.exports = router;
///////////////
