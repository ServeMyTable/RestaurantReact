const mongoose = require("mongoose"); 
const config = require("./default.json");

const connectDB = async ()=>{
    try{
        
        await mongoose.connect(config.MongoDB_Url,{
            useNewUrlParser : true,
            useFindAndModify : false,
            useCreateIndex : true,
            useUnifiedTopology : true,
        });
        console.log("MongoDB Connected Successfully...");
    }catch(err){
        console.log("Error connecting to Database...");
        console.error(err);
        //Exit Process with failure
        process.exit(1);
    }
}

module.exports = connectDB;