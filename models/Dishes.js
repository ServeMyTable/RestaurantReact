const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DishSchema = new Schema({

      DishID : {
            type : String,
            required : true,
      },
      DishName : {
            type : String,
            required : true
      },
      Description : {
            type : String,
      },
      Price : {
            type : Number,
            required : true
      },
      FileName : {
            type : String
      },
      ImageUrl :{
            type : String
      },
      tags:{
            type : Array
      },
      Category : {
            type : String,
            required : true
      },
      Available : {
            type : Boolean,
            default : true
      },

},{
      timestamps:true
});

module.exports = DishSchema;
