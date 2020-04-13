const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/user');
const Book = require('../models/book');
// passport
const passport = require("passport");



const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_SECRET 
  }
});

// Auth Routes

router.get('/signup', (req, res, next) => {
  res.render('signup-form');
});

// signup POST route
router.post('/signup', (req, res, next) => {
  const {
    username,
    email,
    password
  } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    console.log(username, password)
    res.render('signup-form', {
      errorMessage: 'please type username and password;'
    });
    return;
  }

  User.create({
      username,
      email,
      password: hashPass
    }).then(user => {
      console.log(user);
      // firing the email
      transporter.sendMail({
        from: '"My Awesome Project " <noreply@project.com>',
        to: user.email,
        subject: 'Welcome', 
        text: 'Awesome Message',
        html: '<b>Awesome Message</b>'
      })
      .then(info => {
        res.redirect('/login');
      })
      .catch(error => res.render('signup-form', {
        errorMessage: error
      }));

    })
    .catch(err => res.status(400).render('signup-form', {
      errorMessage: err.errmsg
    }));

  // .catch(err => next(err));

});

// LOGIN routes

router.get('/login', (req, res, next) => {
  res.render('login-form');
});

// router.post('/login', (req, res, next) => {
//   const {
//     username,
//     password
//   } = req.body;

//   if (username === '' || password === '') {
//     res.render('login-form', {
//       errorMessage: 'please type username and password'
//     });
//     return;
//   }

//   User.findOne({
//       username
//     })
//     .then(user => {

//       // checking if username exists in database

//       if (!user) {
//         res.render('login-form', {
//           errorMessage: 'invalid username or password'
//         })
//         return;
//       }

//       // since user exits let's check his/her password
//       if (bcrypt.compareSync(password, user.password)) {
//         req.session.currentUser = user;
//         res.redirect('/books');
//       } else {
//         res.render('login-form', {
//           errorMessage: 'invalid password or username'
//         })
//       }

//     })
//     .catch(err => console.log(err));

// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/books",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true,
}));


// LOGOUT route

router.get('/logout', (req, res) => {
  // basic auth
  // req.session.destroy((err) => res.redirect('/login'));

  //passport
  req.logout();
  res.redirect("/login");
})

// SOCIAL LOGIN

// one way to slack
router.get("/auth/slack", passport.authenticate("slack"));

// one way back from slack
router.get("/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/books",
    failureRedirect: "/login"
  })
);


// one way out to google 
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

// onde back from google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/books",
    failureRedirect: "/login" // here you would redirect to the login page using traditional login approach
  })
);

module.exports = router;