const express = require('express');
const router = express.Router();
const postDb = require("../posts/postDb");

router.get('/', (req, res) => {
  postDb
    .get()
    .then(allPosts => {
      res.status(200).json(allPosts);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.get('/:id', validatePostId, (req, res) => {
  const postId = req.params.id;
  
  postDb
    .getById(postId)
    .then(singlePost => {
      res.status(200).json(singlePost);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  const postId = req.params.id;
  
  postDb
    .remove(postId)
    .then(() => {
      res.status(200).json("DELETE OK");
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.put('/:id', validatePostId, (req, res) => {
  const postId = req.params.id;
  const updatedPostInfo = req.body;

  postDb
    .update(postId, updatedPostInfo)
    .then(infoFromDB => {
      res.status(200).json(infoFromDB);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

// custom middleware

function validatePostId(req, res, next) {
  req.postId = req.params.id;

  postDb
    .getById(req.postId)
    .then((post) => {
      post ? next() : res.status(400).json({ message: "invalid post id" });
    });
}

module.exports = router;