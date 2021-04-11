const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({

    RestaurantID : {
        type : String,
        required : true
    }, 
    Attendance : {
        type : Object
    }
});

const Attendance = mongoose.model('attendance',AttendanceSchema);

module.exports = Attendance;