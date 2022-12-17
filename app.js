const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');

const session = require('express-session');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middlewares:

// Authenticated Middleware
app.use(
  session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  })
);

app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).render('homepage', {error: "You are not logged in"});
  } else {
    next();
  }
});

app.use('/register', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/private');
  } else {
    next();
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/protected');
  } else {
    next();
  }
})

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
