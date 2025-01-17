// Requirement of modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

// Include the static web pages
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Dummy user credentials
const user = {
  username: "gopi",
  password: 1234, // Replace with hashed password in production
};

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect("/login");
}

// Routing
// Login Page
app.get("/login", (req, res) => {
  res.render(path.join(__dirname, "../templates/views/login.hbs"));
});

// Handle Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate user credentials
  if (username === user.username && password === user.password) {
    req.session.isAuthenticated = true;
    res.redirect("/");
  } else {
    res.send("<h1>Invalid username or password</h1><a href='/login'>Try again</a>");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/login");
  });
});

// Home Page (Requires Authentication)
app.get("/", isAuthenticated, (req, res) => {
  res.render(path.join(__dirname, "../templates/views/index.hbs"));
});

// About Page (Requires Authentication)
app.get("/about", isAuthenticated, (req, res) => {
  res.render(path.join(__dirname, "../templates/views/about.hbs"));
});

// Weather Page (Requires Authentication)
app.get("/weather", isAuthenticated, (req, res) => {
  res.render(path.join(__dirname, "../templates/views/weather.hbs"));
});

// Error Page
app.get("*", (req, res) => {
  res.render(path.join(__dirname, "../templates/views/error.hbs"));
});

// Listening to the port
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
