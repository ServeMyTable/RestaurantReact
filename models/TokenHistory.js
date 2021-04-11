const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({

    RestaurantID : {
        type :String
    },
    Tokens : {
        type: Array
    }
});

const TokenHistory = mongoose.model('tokenHistory',TokenSchema);

module.exports = TokenHistory;