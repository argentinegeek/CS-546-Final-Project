// All routes related to user profiles
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const validation = require("../helpers");
const xss = require('xss');
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
    let fName = xss(userInfo.firstName);
    let lName = xss(userInfo.lastName);
    let uName = xss(userInfo.userName); //<-- register page inputs have no IDs yet
    let pass = xss(userInfo.password);
    let cPass = xss(userInfo.confirmPassword);

    try {
      fName = validation.checkString(fName, "First Name");
      lName = validation.checkString(lName, "Last Name");
      uName = validation.checkUsername(uName);
      pass = validation.checkPassword(pass);
      cPass = validation.checkPassword(cPass);
      const newUser = await userData.createUser(
        fName,
        lName,
        uName,
        pass,
        cPass
      );
      if (!newUser) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        return res.redirect("/private");
      }
    } catch (e) {
      res.status(400).render("register_page", { error: true, errorMsg: e });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    // if (req.session.user) return res.redirect("/private");
    //line 34 may need data passed as second parameter
    try {
      return res.render("login_page");  
    } catch (e) {
      res.status(500).json({error: e});
    }
    
  })
  .post(async (req, res) => {
    let userInfo = xss(req.body);
    let uName = xss(userInfo.userName); //<-- register page inputs have no IDs yet
    let pass = xss(userInfo.password);

    try {
      uName = validation.checkUsername(uName);
      pass = validation.checkPassword(pass);
      const auth = await userData.checkUser(uName, pass);
      console.log(auth)
      
      if (auth) {
        console.log("logging them in");
        req.session.user = { userName: uName, userId: auth.uID };
        console.log("made them in the session");
      } else {
        res.status(400).render("login_page", { error: true, errorMsg: e });
      }
      return res.redirect("/private");
    } catch (e) {
      res.status(400).render("login_page", { error: true, errorMsg: e });
    }
  });

router.route("/private").get(async (req, res) => {
  //this should render the account info page
  try {
    return res.render("activity");  
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.route("/logout").get(async (req, res) => {
  try {
    req.session.destroy();
    return res.render("logout_page");  
  } catch (e) {
    res.status(500).json({error: e});
  }
  
});

router.route("/settings").get(async (req, res) => {
  if (req.session.user) return res.render("settings_page", {userName: req.session.user.uName});
});

module.exports = router;
