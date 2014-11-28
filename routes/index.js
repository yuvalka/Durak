var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/game/:id', function(req, res) {
  var gameId = req.params.id;

});

module.exports = router;
