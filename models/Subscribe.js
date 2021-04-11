const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema({
    RestaurantID : {type : String},
    SubscriptionID : {type : String},
    SubscriptionStatus: {type : String},
    SubscriptionStartDate : {type : String},
    SubscriptionEndDate : {type : String},
    SubscriptionPlan : {type : String},
    SubscriptionHistory : {type : Array},
},{
    timestamps: true
});

const Subscribe = mongoose.model("Subscription",SubscriptionSchema);

module.exports = Subscribe;