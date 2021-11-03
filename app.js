const express = require("express");
require("./db/conn");
const User = require("./models/users");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello ");
});

app.post("/users", async (req, res) => {
  try {
    const check = await User.findOne({ username: req.body.username });
    if (!check) {
      const user = new User(req.body);
      const createdUser = await user.save();

      res.status(201).send(createdUser);
    } else {
      res.status(403).send("username already exist");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const usersData = await User.find();
    res.status(201).send(usersData);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const userData = await User.findById(_id);

    if (!userData) {
      return res.status(404).send();
    } else {
      res.status(201).send(userData);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    if (!req.body.password) {
      const _id = req.params.id;
      const updateUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true, //immediately update
      });
      res.status(201).send(updateUser);
    } else {
      res.status(403).send("you cannot update the password");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send("id not found");
    }
    res.status(201).send(deletedUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log("connection is set up at ", port);
});
