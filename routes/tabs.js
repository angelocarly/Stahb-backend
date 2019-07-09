var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tabs', function(req, res, next) {
  res.render('tabs', { title: 'Express' });
});

module.exports = router;
