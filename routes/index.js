'use strict';

const express = require('express');
const router  = express.Router();
const graphRoute = require('./graph');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Vivek Jaiswal' });
});

router.get('/random', graphRoute.randomFDG);

router.get('/lesmiserables', graphRoute.miserablesFDG);

router.get('/lesmiserables/character', graphRoute.miserablesCharacter);


module.exports = router;
