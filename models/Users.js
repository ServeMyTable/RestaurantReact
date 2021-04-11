const mongoose = require('mongoose');
const Dishes = require('./Dishes');
const Schema = mongoose.Schema;
const userSchema = new Schema({

      username : { type : String,required : true },
      password : { type : String, required : true },
      email :{ type : String, required : true, unique : true },
      RestaurantName : { type : String, default : "" },
      Dishes : [Dishes],
      Categories : { type : Array },
      Location:{ type : String, default : "" },
      nTables:{ type : Number, min:1, default:1 },
      gstin:{ type : String, default : "" },
      pan : { type : String, default : "" },
      Phone:{ type : Number },
      ImageUrl:{ type : String },
      FileName:{ type : String },
      OtherBankDetails : { type: String },
      RazAccountId : { type: String },
      UPIID : { type: String },
      Taxes :{ type: Array }
},{
      timestamps:true
});

const Users = mongoose.model('User',userSchema);

module.exports = Users;
