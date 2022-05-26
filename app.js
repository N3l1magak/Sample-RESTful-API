//jshint seversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Connect
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article", articleSchema);

/////////////////////// request targeting all articles///////////////////////
app.route("/articles")
// API get
.get(function(req, res){
  Article.find(function(err, set){
    if(!err){
      res.send(set);
    } else {
      res.send(err);
    }
  });
})

// API send
.post(function(req, res){
  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("successfully added a new article");
    } else {
      res.send(err);
    }
  });
})

// API delete
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Successfully deleted all");
    } else {
      res.send(err);
    }
  });
});

/////////////////////// request targeting a specific articles///////////////////////
app.route("/articles/:articleTitle")

// API get
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, result){
    if(!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
})

// API replace specific item
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err) {
      if(!err) {
        res.send("Successfully updated article.");
      }
    }
  );
})

// API Patch
.patch(function(req, res){
  Article.updateOne(
    {_id: req.params.articleTitle},
    {title: req.body.title},
    function(err){
      if(!err) {
        res.send("Successfully updated article.");
      }
    }
  );
})

// API deleted
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if(!err) {
        res.send("Successfully deleted the article.");
      }
    }
  );
});

// Listen
app.listen(8080, function(){
  console.log("Server started at port 8080");
});
