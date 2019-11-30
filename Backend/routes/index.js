const routes = require('express').Router();

const cars = require('./car');

routes.use("/car", cars);

routes.get("/", (req, res) => {
    res.status(200).json({message: 'Hello World!'});
});

module.exports = routes;