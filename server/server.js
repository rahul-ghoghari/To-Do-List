const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongo = require("mongodb");
const List = require("../db/List");
const User = require("../db/User");
require('dotenv').config()
mongoose
  .connect("mongodb+srv://"+process.env.user+":"+process.env.pass+"@todolist.jnovplg.mongodb.net/?appName=todoList", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log("Err:" + err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.status(204);
  
});
app.get("/test", function (req, res) {
  res.send({"status":"Success"});
  
});
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});
app.get("/getData/:email", function (req, res) {
  const email = req.params.email;
  console.log(email);
  List.aggregate([
    { $match: { email: email } },
    { $sort: { dueDate: 1 } },
  ]).then((list) => {
    if (list == null) {
      res.end("No List Found");
      return;
    }
    res.json(list);
  });
});
app.get("/getAllData", function (req, res) {
  List.find({}).then((list) => {
    if (list == null) {
      res.end("No List Found");
      return;
    }
    res.json(list);
  });
});

app.get("/getUser/:email/:pass", function (req, res) {
  const email = req.params.email;
  const pass = req.params.pass;
  User.find({ email: email, password: pass }).then((user) => {
    if (user == null) {
      res.end(false);
      return;
    }
    res.json(user);
  });
});

app.delete("/DeleteList/:id", function (req, res) {
  const id = req.params.id;
  List.deleteOne({ _id: new mongo.ObjectId(id) }).then((err, res) => {});
  res.json({ sucess: id });
});

app.put("/UpdateList/:id", function (req, res) {
  const id = req.params.id;
  const data = req.body;
  console.log(data.dueDate);
  List.findByIdAndUpdate(
    { _id: id },
    { title: req.body.title, dueDate: new Date(req.body.dueDate) }
  )
    .then((list) => {
      if (list == null) console.log("Not FOund!");
      else {
        res.json({
          message: "List information updated successfully",
        });
      }
    })
    .catch((err) => {
      console.log("Error Outer");
      res.status(400).json(err);
    });
});
app.put("/DoneTask/:id", function (req, res) {
  const id = req.params.id;
  List.findByIdAndUpdate({ _id: id }, { complete: true })
    .then((list) => {
      if (list == null) console.log("Not FOund!");
      else {
        res.json({
          message: "List status updated successfully",
        });
      }
    })
    .catch((err) => {
      console.log("Error Outer");
      res.status(400).json(err);
    });
});

app.post("/addList", function (req, res) {
  console.log(req.body);
  var insert = List.collection.insertOne({
    title: req.body.title,
    email: req.body.email,
    dueDate: new Date(req.body.formDate),
  });
  if (insert) {
    res.end("Task add sucessfully!");
  } else {
    res.end("Error while insert!");
  }
});

app.post("/AddUser", function (req, res) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user != null) {
      res.end(false);
      return;
    }
    var insert = User.collection.insertOne(req.body);
    if (insert) {
      res.end("Insert Sucessfully!");
    } else {
      res.end("Error while insert!");
    }
  });
});

app.listen(8090, () => {
  console.log("Server running on localhost:8090");
});
module.exports = app;
