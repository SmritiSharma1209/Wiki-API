const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const _=require("lodash");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true},{ useUnifiedTopology: true });

const app= express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static("public"));

const articleSchema={
  title:String,
  content:String
};

const Article= new mongoose.model("Article", articleSchema);   //Convert Article->articles in collections

/////////////////////////////////////////////Requests Targetting all Articles/////////////////////////////////////////////////////////////////
app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req,res){

  const newArticle=new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully posted");
    }else{
      res.send(err);
    }
  });

})

.delete(function(req,res){

  Article.deleteMany(function(err){
    if(!err){
      res.send("Deleted Succesfully");
    }else{
      res.send(err);
    }
  });

});

// app.get("/articles", );
// app.post("/articles", );
// app.delete("/articles", );



/////////////////////////////////////////////////Request Targetting Specific Articles////////////////////////////////////////////////////////

app.route("/articles/:topic")
.get(function(req,res){
  Article.findOne( { title :req.params.topic}, function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No Article with such title");
    }
  });
})

.put(function(req,res){

  Article.updateOne({title: req.params.topic}, {title: req.body.title, content: req.body.content}, {overwrite:true}, function(err){
    if(!err){
      res.send("Update Successfull");
    }else{
      res.send(err);
    }
  });
})

.patch(function(req,res){
  Article.updateOne({title: req.params.topic},{$set:req.body},function(err){
    if(!err){
      res.send("Update Successful");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){

  Article.deleteOne({title : req.params.topic}, function(err){
    if(!err){
      res.send("Deleted successfully");
    }else{
      res.send(err);
    }
  });
});






app.listen(3000, function(){
  console.log("Server started at 3000");
});
