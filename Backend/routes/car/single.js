var CarData = require('../../models/CarData');

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}

function sameMonth(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth();
}

function sameYear(d1, d2) {
    return d1.getFullYear() === d2.getFullYear();
}

module.exports = (req, res) => {
    var year = req.query.year || null;
    var month = req.query.month || null;
    var day = req.query.day || null;

    if ((year === null && month !== null) || (year === null && day !== null)) {
        res.status(400).json({message: "You need to specify year!"});
    }

    CarData.find({
        license_plate: req.params.plate
    }, function (err, data) {
        if (err) throw err;
        var carData = [];

        if (year !== null) {
            if (month === null && day === null) {
                var checkDate = new Date(year);
                data.forEach(element => {
                    var date = new Date(element.timestamp * 1000);

                    if (sameYear(checkDate, date)) carData.push(element);
                });

                res.status(200).json(carData);
            }
            else if (month !== null && day === null) {
                var checkDate = new Date(year, month - 1);
                data.forEach(element => {
                    var date = new Date(element.timestamp * 1000);

                    if (sameMonth(checkDate, date)) carData.push(element);
                });

                res.status(200).json(carData);
            }
            else if (month !== null && day !== null) {
                var checkDate = new Date(year, month - 1, day);
                data.forEach(element => {
                    var date = new Date(element.timestamp * 1000);

                    if (sameDay(checkDate, date)) {
                        carData.push(element);
                    }
                });

                res.status(200).json(carData);
            }
            else {
                res.status(200).json(data);
            }
        }
        else {
            res.status(200).json(data);
        }
    });
};