'use strict';

const characterService = require('../services/characters');

const randomFDG = function (req, res) {
    res.render('graph', { title: 'Force Directed Graph', graphType: 'random' });
};

const miserablesFDG = function (req, res) {
    res.render('graph', { title: 'Force Directed Graph', graphType: 'miserables' });
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