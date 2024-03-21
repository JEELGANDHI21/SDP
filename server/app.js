require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
require("./db/conn");
const port = 8080;
const session = require("express-session");
const { putObject } = require("./s3");
var jwt = require("jsonwebtoken");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");
const products = require("./model/productsSchema");
const uuid = require("uuid");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const nodemailer = require("nodemailer");
const soldProduct = require("./model/soldproductSchema");

const clientid =
  "703656858870-8lvns28qtssot11raen3av7bs9tv24s9.apps.googleusercontent.com";
const clientsecret = "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";

const allowedDomain = "ddu.ac.in";

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3005"],
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
    const token = jwt.sign(
      {
        data: "foobar",
      },
      "secret",
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ message: "user Login", user: req.user, token: token });
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

app.post("/add-product", async (req, res) => {
  const { name, price, category, productPath, description, studentId } =
    req.body;

  console.log("Received data:", req.body);
  const product_id = uuid.v4();
  try {
    const user = await userdb.findOne({ email: studentId });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    user.products.push({
      product_id: product_id,
      name: name,
      price: price,
    });
    const updatedUser = await user.save();
  } catch (error) {
    console.error("Error updating product offer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  const p = new products({
    product_id,
    name,
    price,
    category,
    productPath,
    description,
    studentId,
  });
  p.save()
    .then(() => {
      res.send({ message: "Saved Successfully" });
    })
    .catch(() => {
      res.status(500).send({ message: "Server Error" });
    });
});

app.get("/get-products", (req, res) => {
  products
    .find()
    .then((result) => {
      // console.log(result, "user data");
      res.send({ products: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/upload", async (req, res) => {
  try {
    let { filename, contentType } = req.body;
    const currentDateTime = new Date().toISOString().replace(/[:.]/g, "-");
    filename = currentDateTime + "-" + filename;
    const url = await putObject(filename, contentType);
    const objectUrl = `https://buynsellhub.s3.ap-south-1.amazonaws.com//uploads/user-uploads/${encodeURIComponent(
      filename
    )}`;
    res.json({ url, objectUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/products/updateOffer/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { userOffer, userId, offerStatus, otp } = req.body;

  try {
    const product = await products.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.offers.push({
      userId: userId,
      offerAmount: userOffer,
      offerStatus: offerStatus,

    });

    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product offer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/api/products/acceptOffer/:productId/:offerId", async (req, res) => {
  const { productId, offerId } = req.params;
  const { offerStatus, otp } = req.body;

  try {
    const product = await products.findOne({ product_id: productId });

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with id ${productId} not found.` });
    }

    const offerIndex = product.offers.findIndex(
      (offer) => offer._id.toString() === offerId
    );

    if (offerIndex !== -1) {

      if (product.offers[offerIndex].otp && product.offers[offerIndex].otp.expires < new Date()) {
        product.offers[offerIndex].otp = undefined;
      } else {
        product.offers[offerIndex].offerStatus = offerStatus;
        product.offers[offerIndex].otp = {
          value: otp,
          expires: new Date(Date.now() + 60 * 1000), // Expiry set to 1 minute
        };
      }

      await product.save();
      return res
        .status(200)
        .json({ message: "Offer status updated successfully." });
    } else {
      return res.status(404).json({
        error: `Offer with id ${offerId} not found for product ${productId}.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/api/products/rejectOffer/:productId/:offerId", async (req, res) => {
  const { productId, offerId } = req.params;
  const { offerStatus } = req.body;

  try {
    const product = await products.findOne({ product_id: productId });

    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with id ${productId} not found.` });
    }

    const offerIndex = product.offers.findIndex(
      (offer) => offer._id.toString() === offerId
    );

    if (offerIndex !== -1) {
      product.offers[offerIndex].offerStatus = offerStatus;
      await product.save();
      return res
        .status(200)
        .json({ message: "Offer status updated successfully." });
    } else {
      return res.status(404).json({
        error: `Offer with id ${offerId} not found for product ${productId}.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jdgandhi4585@gmail.com",
    pass: "rbcm cndl ltjm dctu",
  },
});
app.post("/api/send-email", (req, res) => {
  const { from, to, subject, body, image, productinfo } = req.body;

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: `
    <p>${productinfo}</p>
    <img src="${image}" alt="Product Image" />
    <p>${body}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
    res.json({ message: "Email sent successfully", info });
  });
});

app.post("/add-soldproduct", async (req, res) => {
  const {
    id,
    name,
    category,
    price,
    productPath,
    description,
    ownerId,
    acceptedId,
    acceptedAmount,
  } = req.body;

  console.log("Received data:", req.body);

  const p = new soldProduct({
    id,
    name,
    category,
    price,
    productPath,
    description,
    ownerId,
    acceptedId,
    acceptedAmount,
  });
  p.save()
    .then(() => {
      res.send({ message: "Saved Successfully" });
    })
    .catch(() => {
      res.status(500).send({ message: "Server Error" });
    });
});

app.delete("/delete-product/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const result = await products.deleteOne({ product_id: productId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Product deleted successfully!" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/api/products/setOfferStatus/:productId/:offerId", async (req, res) => {
  const { productId, offerId } = req.params;

  try {
    const product = await products.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ error: `Product with id ${productId} not found.` });
    }

    const offerIndex = product.offers.findIndex(offer => offer._id.toString() === offerId);

    if (offerIndex !== -1) {
      const offer = product.offers[offerIndex];

      // Check if OTP exists and has expired
      if (offer.otp && offer.otp.expires < new Date()) {
        product.offers[offerIndex].offerStatus = "pending";
        await product.save();
        return res.status(200).json({ message: "Offer status set to pending successfully." });
      } else {
        return res.status(400).json({ error: "OTP is either not expired or does not exist." });
      }
    } else {
      return res.status(404).json({ error: `Offer with id ${offerId} not found for product ${productId}.` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/api/products/deleteOTP/:productId/:offerId', async (req, res) => {
  const { productId, offerId } = req.params;

  try {

    const product = await products.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ error: `Product with id ${productId} not found.` });
    }

    const offerIndex = product.offers.findIndex(offer => offer._id.toString() === offerId);

    if (offerIndex !== -1) {

      product.offers[offerIndex].otp = undefined;

      await product.save();

      return res.status(200).json({ message: 'Expired OTP deleted successfully.' });
    } else {
      return res.status(404).json({
        error: `Offer with id ${offerId} not found for product ${productId}.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await userdb.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/soldproducts', async (req, res) => {
  try {
    const sp = await soldProduct.find();
    res.json(sp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await userdb.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server Started on ${port} `);
});