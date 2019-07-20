var express = require('express');
var router = express.Router();
let jwt = require('express-jwt');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Tab = mongoose.model('Tab');

let auth = jwt({ secret: process.env.BACKEND_SECRET });

/* GET home page. */
router.get('/', function (req, res, next) {
  Tab.find({}, 'id artist song', function (err, ids) {
    if (err) { return handleError(next, err); }
    if (!ids) { return handleError(next, "Couldn't find tabs"); }

    res.send(ids);
  })
});

/* POST tab */
router.post('/', auth, function (req, res, next) {

  if (!req.body.artist || !req.body.song || !req.body.tab) {
    return res.status(400).json(
      { message: 'Please fill out all fields (artist, song, tab, [tuning])' });
  }

  let tab = new Tab();
  tab.artist = req.body.artist;
  tab.song = req.body.song;
  tab.tab = req.body.tab;
  tab.author = req.user._id;

  if(req.body.tuning) tab.tuning = req.body.tuning;

  tab.save(function (err) {
    if (err) { return next(err); }
    return res.json({ tab })
  });
});

//GET tab by id
router.get('/:tab', function (req, res, next) {
  res.json(req.tab);
})

router.param('tab', function (req, res, next, id) {
  let query = Tab.findById(id);
  query.exec(function (err, tab) {
    if (err) {
      return next(err);
    }
    if (!tab) {
      return next(new Error('not found ' + id));
    }
    req.tab = tab;
    return next();
  });
});

module.exports = router;
