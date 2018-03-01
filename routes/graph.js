'use strict';

const characterService = require('../services/characters');

const randomFDG = function (req, res) {
    res.render('index', { title: 'Random Force Graph', graphType: 'random' });
};

const miserablesFDG = function (req, res) {
    res.render('index', { title: 'Les Miserables Force Graph', graphType: 'miserables' });
};

const miserablesCharacter = function (req, res) {

    var character = characterService(req.param('id'));

    if (!character) {
        character = {name : req.param('id'), description : 'No description available'};
    }

    res.status(200).json({ name : character.name, description : character.description});
};

module.exports = {
    randomFDG : randomFDG,
    miserablesFDG : miserablesFDG,
    miserablesCharacter : miserablesCharacter
};
