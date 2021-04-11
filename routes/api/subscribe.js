const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Subscribe = require('../../models/Subscribe');
const User = require('../../models/Users');
const RazorPay = require("razorpay");
const crypto = require('crypto');
const R = require('../../razorpay.json');

var RazorPayInstance = new RazorPay({
    key_id : R.RAZORPAYKEY,
    key_secret : R.RAZORPAYSECRET,
});


router.get('/',auth,async (req,res)=>{
    
    try {

        const user = await User.findById(req.user.id).select('-password');
        const subscriptionDetails = await Subscribe.findOne({RestaurantID : user.Phone});
        if(subscriptionDetails.SubscriptionEndDate <= new Date().getTime())
        {
            const mResponse = await Subscribe.findOneAndUpdate(
                {RestaurantID : user.Phone},
                {$set:{
                    SubscriptionStatus:"EXPIRED"
                }}
            );
            res.status(200).send(mResponse);
        }
        else
        {
            res.status(200).send(subscriptionDetails);
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

router.post("/payment",auth,async (req,res)=>{

    const {PlanType} = req.body;
    var Amount;
    
    if(PlanType === "Monthly"){ Amount = R.MONTHLYPLANPRICE }
    else { Amount = R.QUATERLYPLANPRICE }

    const options = {
        amount: Amount,
        currency: "INR",
        receipt: "receipt-"+(new Date().getTime()),
        payment_capture:1,
    };

    try{
        //Creating Order
        const order = await RazorPayInstance.orders.create(options);

        res.status(200).send({
            id: order.id,
			currency: order.currency,
			amount: order.amount
        })
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error")
    }
    
});

router.post("/verification",async (req,res)=>{

     try {

        const shasum = crypto.createHmac('sha256', R.SECRETWEBHOOK);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['X-Razorpay-Signature']) {
            
            const email = req.body.payload.payment.entity.email;
            const amount = req.body.payload.payment.entity.amount;
            const user = await User.findOne({email:email});
            const subscribe = await Subscribe.findOne({RestaurantID : user.Phone});
            const Today = new Date().getTime();
            if(subscribe.SubscriptionEndDate <= Today){

                let Plan;
                const SubscriptionStartDate = Today;
                let SubscriptionEndDate;
                            
                if(amount === QUATERLYPLANPRICE){
                    Plan = "QUATERLY";
                    SubscriptionEndDate = new Date(new Date().setDate((new Date().getDate()+90))).getTime();
                }else{
                    Plan = "MONTHLY";
                    SubscriptionEndDate = new Date(new Date().setDate((new Date().getDate()+30))).getTime();
                }

                //Update Subscription
                mBody = req.body;
                const b = {
                    SubscriptionStatus : "ACTIVE",
                    SubscriptionStartDate : SubscriptionStartDate,
                    SubscriptionEndDate : SubscriptionEndDate,
                    SubscriptionPlan : Plan.toString().toUpperCase(),
                };
                await Subscribe.findOneAndUpdate(
                    {RestaurantID : RestaurantID},
                    {$set : b, $push : {SubscriptionHistory : mBody}}
                )
            }    
        }
    } catch (error) {
        console.log(error);
    }

	res.json({ status: 'ok' })
});

router.post("/update",async (req,res)=>{

    const {payment_id,order_id} = req.body;
    try{
        const res1 = await RazorPayInstance.payments.fetch(payment_id);
        const res2 = await RazorPayInstance.orders.fetch(order_id);
        
        if(res1.status === "captured")
        {
            const email = res1.email;
            const amount = res2.amount;
            const user = await User.findOne({email:email});
            const RestaurantID = user.Phone;
            const subscribe = await Subscribe.findOne({RestaurantID : user.Phone});
            const Today = new Date().getTime();
            if(subscribe.SubscriptionStatus === "EXPIRED" && subscribe.SubscriptionEndDate <= Today)
            {
                let Plan;
                const SubscriptionStartDate = Today;
                let SubscriptionEndDate;

                if(amount === R.QUATERLYPLANPRICE)
                {
                    Plan = "QUATERLY";
                    SubscriptionEndDate = new Date(new Date().setDate((new Date().getDate()+90))).getTime()

                }else{
                    Plan = "MONTHLY";
                    SubscriptionEndDate = new Date(new Date().setDate((new Date().getDate()+30))).getTime()
                }
                const body = {Payment:{...res1},Order:{...res2}};
                const b = {
                    SubscriptionStatus : "ACTIVE",
                    SubscriptionStartDate : SubscriptionStartDate,
                    SubscriptionEndDate : SubscriptionEndDate,
                    SubscriptionPlan : Plan.toString().toUpperCase(),
                };
                await Subscribe.findOneAndUpdate(
                    {RestaurantID : RestaurantID},
                    {$set : b, $push : {SubscriptionHistory : body}}
                )
            }
        }
        res.status(200).send("ok");
        
    }catch(err){
        console.log(err);
    }
    

});

module.exports = router;