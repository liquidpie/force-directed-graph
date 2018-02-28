'use strict';

const express = require('express');
const router  = express.Router();
const graphRoute = require('./graph');

/* GET home page. */
router.get('/', graphRoute.miserablesFDG);

router.get('/character', graphRoute.miserablesCharacter);

router.get('/random', graphRoute.randomFDG);

module.exports = router;
