const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

mongoose.connect('mongodb+srv://fullstack:VRnD8NwOVIFcbROu@cluster0-x4aju.mongodb.net/test?retryWrites=true&w=majority')
.then(() =>{
  console.log('Successfully connected to mongoDB Atlas');
    })
  .catch((error) =>{
    console.log('unable to connect to MongoDB Atlas');
    console.log(error);
});

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

//addd items to mongo db
app.post('/api/recipes',(req, res, next)=> {
  const receipe = new Recipe({
    title:req.body.title,
    ingredients:req.body.ingredients,
    instructions:req.body.instructions,
    time: req.body.time,
    difficulty: req.body.difficulty,
    difficulty: req.body.difficulty,
  });
  receipe.save().then(
    ()=>{
    res.status(201).json({
      message: 'Post Saved Successfully'
    })
  }
).catch(
  (error)=>{
    res.status(400).json({
      error: error
    });

  }
);
});


//fetch by:
app.get('/api/recipes/:id', (req,res,next) => {
  Recipe.findOne({
    _id: req.params.id
  }).then(
    (recipe)=>{
      res.status(200).json(recipe);
    }
  ).catch(
    (error) =>{
      res.status(404).json({
        error: error
      });
    }
  );
});

//update
app.put('/api/recipes/:id', (req,res,next) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title:req.body.title,
    ingredients:req.body.ingredients,
    instructions:req.body.instructions,
    time: req.body.time,
    difficulty: req.body.difficulty,

  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () =>{
      res.status(201).json({
        message: 'Recipe Updated Successfully!'
      });
    }
  ).catch(
    (error) =>{
      res.status(404).json({
        error: error
      });
    }
  );
});

// delete a thing
app.delete('/api/recipes/:id',(req,res,next) =>{
  Recipe.deleteOne({_id:req.params.id}).then(
    ()=>{
      res.status(200).json({
        message: 'Deleted'
      });
    }
  ).catch(
    (error) =>{
      res.status(400).json({
        error: error
      });
    }
  );
});

//fetch all from database
app.use('/api/recipes', (req,res,next) => {
  Recipe.find().then(
    (recipes)=>{
      res.status(200).json(recipes);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error:error
      });
    }
  );

});

module.exports = app;
