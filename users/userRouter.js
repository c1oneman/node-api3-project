const express = require('express');
const router = express.Router();
const userDb = require("./userDb");
const postDb = require("../posts/postDb");

router.post('/', validateUser, (req, res) => {
  const newUserInfo = req.body;

  userDb
    .insert(newUserInfo)
    .then(infoFromDB => {
      res.status(201).json(infoFromDB);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPostInfo = req.body;
  const userId = req.params.id;

  postDb
    .insert({ ...newPostInfo, user_id: userId })
    .then(infoFromDB => {
      res.status(201).json(infoFromDB);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.get('/', (req, res) => {
  userDb
    .get()
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const userId = req.params.id;
  
  userDb
    .getById(userId)
    .then(singleUser => {
      res.status(200).json(singleUser);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userId = req.params.id;
  
  userDb
    .getUserPosts(userId)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const userId = req.params.id;
  
  userDb
    .remove(userId)
    .then(() => {
      res.status(200).json("DELETE OK");
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const userId = req.params.id;
  const updatedUserInfo = req.body;
  
  userDb
    .update(userId, { ...updatedUserInfo, id: userId })
    .then(infoFromDB => {
      res.status(200).json(infoFromDB);
    })
    .catch(() => {
      res.status(500).json("ERROR");
    });
});

//custom middleware

function validateUserId(req, res, next) {
  req.user = req.params.id;

  userDb
    .getById(req.user)
    .then((user) => {
      user ? next() : res.status(400).json({ message: "invalid user id" });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  }
  else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  }
  else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
  else {
    next();
  }
}


module.exports = router;