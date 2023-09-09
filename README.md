# Robin-Mosaab
**This is an app about posting posts following users comments replies and authentecation**.
## This app contains.
### Controllers folder to create read, delete and update documents in mongoDB.
**Inside the handlerFactory.js there is comments about how to create read update and delete documents**.
**CommentController file is for reading, creating, deleting and updating comments, the errorController file is for errors, followControler file is for creating and reading and deleting documents that uses the followModel Schema in the models folder, postController file is about creating, deleting, updating, reading posts and replyController file is about creating deleting updating reading replies**.
**Inside the authController.js there is comments that explain the code**.
**The authController file is responsible for authentication with functions for signUp, logIn, protect for protecting routes from not signed In users, forget password that send reset token, resetPassword to reset the password based on the previews token, updateMe and updatePassword responsible for updating user Info and Password, deleteMe for setting the user active property in the user document to false**.
### Utils folder. 
**appError file that Inside  class that send an error when called**.
**email file that send an email using nodemailer module**.
**catchAsync for to catch errors instead of using try catch blook**.
### Models for the Schemas of the DB.
**Inside commentModel.js and replyModel.js there is comments about the code and some of the functionality in the code**.
**Inside userModel there are comments about the code and there are methods that we will be using in the ./controllers/authController.js file**.
### Routes folder contains:
**homeRouter file for post and comment and reply and follow routes to use them with with thier Controllers**.
**userRouter for authentication and following users**.
#### Other files.
**server.js for running the server and app.js using the routes files in the routes folder, and also modules about security**.
**Link about postman docs is here:
https://documenter.getpostman.com/view/22054966/2s9YC1WZoX**.
**To use the app with your own DB you can change the URL in the config.env file this way you can connect to your own cluster**.





