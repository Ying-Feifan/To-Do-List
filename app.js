//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const capitalize = require('capitalize');

// use express
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
//connect to database
const mongodbUrl = "mongodb://127.0.0.1:27017/todolistDB";
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Schema and Model
const itemSchema = {
  item: String
};
const listSchema = {
  listName: String,
  list: [itemSchema]
};
const List = mongoose.model("List", listSchema);


//Rest
app.get("/", function(req, res) {
  res.redirect("/ToDoList");
});

app.get("/:customName", function(req, res) {
  let customName = capitalize(req.params.customName);

  //Find list
  List.findOne({
    listName: customName
  }, function(err, result) {
    if (result) {
      listItems = result.list;
      // Render
      res.render("list", {
        day: date(),
        listItems: result.list,
        customName: customName
      });
    } else {
      let customList = new List({
        listName: customName,
        list: [{
          item: 'Create your list'
        }]
      });
      customList.save(function(err) {
        res.redirect("/"+customName);
      });
    }
  });
});

app.post("/", function(req, res) {
  let newItem = {
    item: req.body.newItem
  };
  let listName = req.body.listName;
  List.findOne({
    listName: listName
  }, function(err, result) {
    result.list.push(newItem);
    result.save();
    res.redirect("/"+listName);
  });
});

app.post("/delete", function(req, res) {
let listName = req.body.listName;
let itemId =req.body.itemId;
  List.findOneAndUpdate({
    listName: listName
  }, {
    $pull: {
      list: {
        _id: itemId
      }
    }
  }, function(err, result) {
    res.redirect("/"+listName);
  });
});

//Server
app.listen(3000, function() {
  console.log("server started on port 3000");
});
