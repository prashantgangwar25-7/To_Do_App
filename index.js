const express = require("express");
const app = express();

const mongoose = require('mongoose');

require("dotenv").config();

// mongoose.connect('mongodb://localhost:27017/to_do', {useNewUrlParser: true});
mongoose
  .connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended: true}));//Syntax for using body-parser

app.set('view engine', 'ejs');

app.use(express.static('public'));

const schemaName = new mongoose.Schema({
    name: String
});

const modelName = mongoose.model('collectionName', schemaName);  

app.get("/", function(req,res){
    modelName.find(function (err, collectionnames){
        if(err){console.log(err);}
        else{
            res.render("list", {addTask: collectionnames});
            };
      });
});

app.post("/", function(req,res){
    let next = req.body.nextTask;//stores the text written by user in form using body-parser module
    if(next !="") {
        let document = new modelName ({
        name: next
        });
        document.save();
    };

    let delTask = req.body.checked;
    modelName.deleteOne({name: delTask}, function(err){
            if(err){console.log(err);}
            else{console.log("Task Deleted");}
          });
    res.redirect("/");//Redirects to the home route
});

const PORT = process.env.PORT ||80;
app.listen(PORT, () => console.log(`To Do App listening at http://localhost:${PORT}`))