require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
require("./db/conn");
const port = 8080;
const session = require("express-session");
const { putObject } = require("./s3");

const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");
const products = require("./model/productsSchema");

const clientid =
  "703656858870-8lvns28qtssot11raen3av7bs9tv24s9.apps.googleusercontent.com";
const clientsecret = "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";

const allowedDomain = "ddu.ac.in";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "12fhsoduboga211",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userDomain = profile.email.split("@")[1];
        console.log("User domain:", userDomain);

        if (userDomain !== allowedDomain) {
          console.log("Domain not allowed");
          return done(null, false, { message: "Domain not allowed" });
        }

        console.log("Allowed domain");

        let user = await userdb.findOne({ googleId: profile.id });
        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google auth login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect:
      "http://localhost:3000/login?alert=" +
      encodeURIComponent("Domain not allowed"),
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

app.post("/add-product", (req, res) => {
  const { name, price, category, productPath, studentId } = req.body;

  console.log("Received data:", req.body);
  const p = new products({ name, price, category, productPath, studentId });
  p.save()
    .then(() => {
      res.send({ message: "Saved Successfully" });
    })
    .catch(() => {
      res.status(500).send({ message: "Server Error" });
    });
});

app.post("/api/upload", async (req, res) => {
  try {
    let { filename, contentType } = req.body;
    const currentDateTime = new Date().toISOString().replace(/[:.]/g, "-");
    filename = currentDateTime + "-" + filename;
    const url = await putObject(filename, contentType);
    const objectUrl = `https://buynsellhub.s3.ap-south-1.amazonaws.com//uploads/user-uploads/${encodeURIComponent(filename)}`;

    res.json({ url, objectUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server Started on ${port} `);
});
