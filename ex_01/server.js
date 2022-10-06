const express = require('express');
const app = express();
const port = 4242;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const hash = crypto.createHash('sha256');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");
app.set("views", "./views");

mongoose.connect("mongodb+srv://charlelie:rijogapi@charlelie.h3sbgi7.mongodb.net/students", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const registerSchema = {
  username: {
    type: String,
    required: true,
    min: 5,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Boolean,
    required: true,
  },
};

const Register = mongoose.model("Register", registerSchema);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/login", function (request, response) {

  response.render("login");
});

app.get("/register", function (request, response) {

  response.render("register");
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  data = hash.update(req.body.password, 'utf-8');
  const password = data.digest('hex');

  Register.count({ username: username, password: password }, async function (err, count) {
    if (err) {
      const err = new Error('Identifiant incorrect');
      err.status = 400;
      throw err;
    } else {
      if (count == 1) {
        const myObj = await Register.findOne({username, password}/* , {username: true} */)
        console.log(myObj);
        res.render("homepage", { myObj });
      }
      else {
        res.render("login");
      }
    }
  })
});

app.post("/register", function (req, res) {
  if (req.body.password !== req.body.passwordConfirm) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    throw err;
  }
  else {
    data = hash.update(req.body.password, 'utf-8');
    gen_hash = data.digest('hex');
    const user = new Register({
      username: req.body.username,
      email: req.body.email,
      password: gen_hash,
      role: false,
    });
    user.save(function (err) {
      if (err) {
        const err = new Error('Username ou Email déja utilisé');
        err.status = 400;
        throw err;
      } else {
        res.render("login");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});