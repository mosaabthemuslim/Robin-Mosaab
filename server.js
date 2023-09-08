const mongoose = require("mongoose");
const dotenv = require("dotenv");
///////////////
const app = require("./app");
///////////
dotenv.config({ path: "./config.env" });
const DB = process.env.DB_URL;
//////////////////
mongoose.connect(DB).then(() => console.log("DB connection is seccesful"));
const server = app.listen(3000, () => console.log("connected on port 3000"));
////////////
process.on('unhandledRejection', err => {
    console.log('unxpected rejection 💣');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1)
    })
});
