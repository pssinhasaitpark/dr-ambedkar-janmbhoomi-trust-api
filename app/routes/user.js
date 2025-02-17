const express = require('express');
const router = express.Router();
const {users}=require("../controllers")
const { verifyUser,verifyRole} = require('../middlewares/jwtAuth');

  router.post("/register", users.registerUser);
  router.post("/login", users.loginUser, verifyRole);
  router.post("/me",verifyUser,users.me);
  router.put("/update",verifyUser,users.updateUser);

module.exports = router;
