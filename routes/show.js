var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//let index = require('../controllers/show');
//router.get('/show', index.index);
//module.exports = router;


router.get('/', function(req, res, next) {
    res.send('respond with a resource IUUUUUUUUUUUUU');
});

module.exports = router;