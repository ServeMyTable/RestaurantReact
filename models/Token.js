const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SingleSchema = new Schema({
    tokenNo : {
        type : Number,
    },
    Name : {
        type : String,
    },
    NoOfPersons : {
        type : Number,
    },
    Status : {
        type : String
    }
});

const TokenSchema = new Schema({

    RestaurantID : {
        type :String
    },
    Tokens:[SingleSchema],
    tokenOngoing : {
        type : Number
    },
    Date : {
        type : String
    }
});

const Token = mongoose.model('token',TokenSchema);

module.exports = Token;