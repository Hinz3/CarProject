const models = require('express').Router();
const single = require('./single');

models.get('/:plate', single);

module.exports = models;