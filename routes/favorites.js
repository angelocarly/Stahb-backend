var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Tab = mongoose.model('Tab');

let jwt = require('express-jwt');
let auth = jwt({ secret: process.env.BACKEND_SECRET });

router.get('/', auth, function (req, res, next) {

  User.findById(req.user._id).select('favorites').exec(function (err, user) {
    if (err) { return handleError(next, err); }

    let favs = user.favorites
    Tab.find({ _id: favs }, 'artist song', function (err, ids) {
      if (err) { return handleError(next, err); }
      if (!ids) { return handleError(next, "Couldn't find tabs"); }

      return res.send(ids);
    })
  })

})

//Add a favorite to the user
router.post('/', auth, function (req, res, next) {

  if (!req.body.id) {
    return res.status(400).json(
      { message: 'Please fill out the id' });
  }

  //Verify if the tab exists
  Tab.find({ _id: req.body.id }, { _id: 1 }, function (err, tab) {
    if (err) {
        return res.status(400).send(err)
    }

    //Ignore request if the tab does not exist
    if(tab.length === 0) {
      return res.status(400).send({message: `No tabs exist with id ${req.body.id}`})
    }

    //Add the id to the user's favorites
    User.updateOne(
      { _id: req.user._id },
      { $addToSet: { favorites: req.body.id } },
      function (err, user) {
        if (err) return res.sendStatus(400)

        //Success
        else return res.sendStatus(200)
      }
    )

  }).limit(1)

})

//Remove a favorite from the user
router.delete('/', auth, function (req, res, next) {
  if (!req.body.id) {
    return res.status(400).json(
      { message: 'Please fill out the id' });
  }

  User.updateOne(
    { _id: req.user._id },
    { $pull: { favorites: req.body.id } },
    function (err, user) {
      if (err) return res.sendStatus(400)
      else return res.sendStatus(200)
    }
  )
})

// router.get('/:user', function(req, res, next)
// {
//   res.json(req.user);
// })


module.exports = router;