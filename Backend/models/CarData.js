var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('CarData', new Schema( {
    license_plate: String,
    speed: String,
    rpm: String,
    throttle_position: String,
    gps: String,
    timestamp: String
}))