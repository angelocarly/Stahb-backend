var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');

passport.use(new LocalStrategy(
  function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
      });
  }
))

router.post('/login/', function(req, res, next){
  if(!req.body.username || !req.body.password){
      return res.status(400).json(
        {message: 'Please fill out username and password'});
  }
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }
    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register/', function(req, res, next){
  
  if(!req.body.username || !req.body.password){
      return res.status(400).json(
        {message: 'Please fill out all fields'});
  }
  let user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password)
  user.save(function (err){
      if(err){ return next(err); }
      return res.json({token: user.generateJWT()})
  });
});

router.param('user', function(req, res, next, id) {
  let query = User.findById(id);
  query.exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('not found ' + id));
    }
    req.user = user;
    return next();
  });
});

router.get('/:user', function(req, res, next)
{
  res.json(req.user);
})

router.post('/:user/weightEntries/', function(req, res, next){
  
  let user = new User(req.body);

  user.save(function(err, weightEntries) {
    if(err) return next(err);

    req.user.weightEntries.push(weightEntry);
    req.user.save(function(err, rec) {
      if(err) return next(err);
      res.json(weightEntry);
    })
  })
  if(!req.body.weightEntry){
      return res.status(400).json(
        {message: 'No data entered'});
  }
});

router.post('/checkusername/', function(req, res, next) {
  User.find({username: req.body.username}, 
    function(err, result) {
      if (result.length) {
        res.json({'username': 'alreadyexists'})
      } else {
        res.json({'username': 'ok'})
      }
  });
});

module.exports = router;