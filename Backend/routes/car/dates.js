var CarDate = require("../../models/CarData");
var functions = require("../../functions");

module.exports = (res, req) => {
    var startDate = req.query.startDate || null;
    var endDate = req.query.endDate || null;

    if (startDate === null && endDate === null) {
        res.status(400).json({message: "You need to specify start date and end date!"});
    }

    var d1 = startDate.split("/");
    var d2 = endDate.split("/");

    var from = new Date(d1[1], parseInt(d1[2])-1, d1[0]);
    var to   = new Date(d2[1], parseInt(d2[2])-1, d2[0]);

    CharacterData.find({
        license_plate: req.params.plate
    }, function (err, data) {
        if (err) throw err;

        var carData = [];

        data.forEach(element => {
            var check = new Date(element.timestamp * 1000);

            if (check >= from && check < to) {
                carData.push(element);
            }
        });

        res.status(200).json(carData);
    });
}