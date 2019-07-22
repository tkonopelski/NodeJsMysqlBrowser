var express = require('express');
var router = express.Router();

let index = require('../controllers/index');

router.get('/', index.index);
router.get('/databases', index.databases);
router.get('/gettable', index.gettable);
router.get('/gettables', index.gettables);

module.exports = router;
