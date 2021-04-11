const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Token = require('../../models/Token');
const User = require('../../models/Users');
const TokenHistory = require('../../models/TokenHistory');

// GET api/token/
router.get("/",auth,async (req,res)=>{

    try{
        const user = await User.findOne({_id:req.user.id});
        const tokens = await Token.findOne({RestaurantID : user.Phone});
        if(tokens != null){
            res.status(200).send(tokens.Tokens);
        }else{
            res.status(200).send([]);
        }
        
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST api/token/
// ADD Token
router.post("/",auth,async (req,res)=>{
    
    try {
        const CustomerName = req.body.CustomerName;
        const NoOfPersons = req.body.NoOfPersons;

        const user = await User.findOne({_id:req.user.id});
        const Alltokens = await Token.findOne({RestaurantID : user.Phone});

        const today = new Date().toISOString().slice(0, 10);

        var tokenNo;
        if(Alltokens !== null){
            const DateToCompare = new Date(Alltokens.Date).toISOString().slice(0,10);
            if(today === DateToCompare){
                tokenNo = parseInt(Alltokens.tokenOngoing) + 1;
            }else{
                tokenNo = 1;
            }
        }else{
            tokenNo = 1;
        }

        

        await Token.updateOne({RestaurantID : user.Phone},
            {
            $push : {
                Tokens : {
                    tokenNo: tokenNo,
                    Name : CustomerName,
                    NoOfPersons : NoOfPersons,
                    Status : 'Booked'
                }        
            },
            $set:{
                tokenOngoing : tokenNo,
                Date : today
            },
            },
            {upsert : true}
        )
        
        res.status(200).send("ok");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//POST api/token/remove
router.post("/remove",auth,async (req,res)=>{

    try {
        
        const tokenNo = req.body.tokenNo;
        const user = await User.findOne({_id:req.user.id});
        const today = new Date().toISOString().slice(0, 10);
        await Token.findOneAndUpdate(
            {RestaurantID : user.Phone},
            {
                $pull:{
                    Tokens:{
                        tokenNo : tokenNo
                    }
                }
            });
        const data = {
            Date: today,
            CustomerName:req.body.CName,
            NoOfPersons:req.body.NOP,
            tokenNo:tokenNo
        }
        await TokenHistory.updateOne({RestaurantID : user.Phone},{
            $push:{
                Tokens:data
            }
        },
        {upsert:true});
        
        res.status(200).send('ok');

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.post('/changeStatus',auth,async (req,res)=>{
    try {
        
        const tokenNo = req.body.tokenNo;
        const user = await User.findOne({_id:req.user.id});
        await Token.updateMany({RestaurantID : user.Phone,'Tokens.tokenNo':tokenNo},{
            $set:{
                'Tokens.$.Status':'Called'
            }
        });
        res.status(200).send("ok");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;