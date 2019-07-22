var express = require('express');
var router = express.Router();


let table = require('../controllers/table');

router.get('/', table.index);

router.get('/querytable', table.querytable);

module.exports = router;