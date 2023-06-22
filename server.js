const express = require("express");
const expressSession = require("express-session")
const MongoStore = require("connect-mongo")
const app = express();
const dotenv = require("dotenv");
const userRouter = require("./Routes/users/userRoute");
const postRouter = require("./Routes/posts/postRoute");
const commentRouter = require("./Routes/comments/commentRoute");
const globalErrorHandler = require("./Middlewares/globalErrorHandler");
dotenv.config();
require("./Config/dbConnect");

// configurations

app.use(express.json());

app.set("view engine", "ejs");

app.use(expressSession({
    secret: `${process.env.mainUrl}`,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.mainUrl,
        ttl: 24*60*60
    })
  
}))
// routes ........
// user route
app.get("/", (req, res) => {
    return res.json({"msg":"welcome here"})
})
app.use("/user", userRouter)
//  ...............................
// post route
app.use("/post", postRouter)
//  ...............................
// commentt route
app.use("/comment", commentRouter)
//  ...............................
// error handling
app.use(globalErrorHandler)
// server connection .....
app.listen(9000, () => console.log("server connected ..."));
