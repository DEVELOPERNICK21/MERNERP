const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');

const User = require("../model/userSchema");

router.use(cookieParser());

// router.get('/',(req,res) =>
// {
//     res.send(`Hello this is home page from router`)
// });

// Signup || register route module started

router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Please Fill the input Correctly" });
  }
  try {
    const userExit = await User.findOne({ email: email });

    if (userExit) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Password are not matching" });
    } else {
      const user = new User({ name, email, phone, password, cpassword });
      await user.save();
      res.status(201).json({ message: "User Registerd Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Signup || register route module Ended

// SigIn || LogIn route module Ended

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the details" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
    const isMatch = await bcrypt.compare(password,userLogin.password);

     token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true
      });

    if (!isMatch)
    {
      return res.status(400).json({ error: "User Error" });
    } 
    else
    {
      res.json({ message: "User Sigin succefully" });
    }

      // return res.status(400).json({ error: "User Error" });
    } else {
      return res.status(400).json({ error: "User Error" });
    }
  } catch (err) {
    console.log(err);
  }
});


// Authentication for Dashboard page 

router.get('/index', authenticate, (req, res) => {
  console.log(`This is Dashboard`);
  res.send(req.rootUser);
});

// Authentication for Dashboard page 

router.get('/supportbackend', authenticate, (req, res) => {
  console.log(`This is Contact`);
  res.send(req.rootUser);
});


// router.get('/signout', (req, res) => {
//   console.log(`This is Logout`);
//   res.clearCookie('jwtoken', {path: '/'});
//   res.status(200).send("This is Logout");
// });

module.exports = router;
