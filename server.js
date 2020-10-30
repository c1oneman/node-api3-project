const express = require('express');
const server = express();
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, URL: ${req.originalUrl}, Timestamp: ${new Date()}`);
  next();
}

module.exports = server;
