// All routes related to user profiles
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../helpers");
//make sure to include error checking for routes
router.route("/").get(async (req, res) => {
  if (req.session.user) return res.redirect("/private");
  return res.render("home_page");
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) return res.redirect("/private");
    //line 15 may need data passed as second parameter
    return res.render("register_page");
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    let fName = userInfo.firstName;
    let lName = userInfo.lastName;
    let uName = userInfo.userName; //<-- register page inputs have no IDs yet
    let pass = userInfo.password;
    let cPass = userInfo.confirmPassword;
    try {
      fName = validation.checkString(fName, "First Name");
      lName = validation.checkString(lName, "Last Name");
      uName = validation.checkUsername(uName);
      pass = validation.checkPassword(pass);
      cPass = validation.checkPassword(cPass);
    } catch (e) {
      return res.status(400).json({ error: `${e}` });
    }
    try {
      const newUser = await userData.createUser(
        fName,
        lName,
        uName,
        pass,
        cPass
      );
      // res.json(newUser);
    } catch (e) {
      res.status(500);
      return;
    }
    return res.redirect("/login");
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) return res.redirect("/private");
    //line 34 may need data passed as second parameter
    return res.render("login_page");
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    let uName = userInfo.userName; //<-- register page inputs have no IDs yet
    let pass = userInfo.password;
    try {
      uName = validation.checkUsername(uName);
      console.log(uName);
      pass = validation.checkPassword(pass);
      console.log(pass);
    } catch (e) {
      return res.status(400).render('login_page', { error: true, errorMsg: e});
    }
    try {
      const auth = await userData.checkUser(uName, pass);
      if (auth) {
        req.session.user = { userName: uName, userId: auth.uID };
      } else {
        throw 'error';
      }
      // res.json(auth);
    } catch (e) {
      return res.status(400).render('login_page', { error: true, errorMsg: e});
    }
    // req.session.user = { userName: uName, userId: auth.uID };
    return res.redirect("/private");
  });

router.route("/private").get(async (req, res) => {
  //this should render the account info page
  //12/16 - rendering to the songs page
  return res.render("activity_page");
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("logout_page");
});

module.exports = router;
