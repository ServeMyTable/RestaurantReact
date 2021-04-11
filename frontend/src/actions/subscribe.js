import { SUBSCRIBE_DATA_FAIL, SUBSCRIBE_DATA_PASS } from './types';
import axios from 'axios';
//import { setAlert } from './alert';

export const getSubscriptionDetails = () => async dispatch=>{
    try {
        
        const res = await axios.get("/api/subscribe");
        dispatch({
            type : SUBSCRIBE_DATA_PASS,
            payload : res.data,
        });        

    } catch (error) {
        console.log(error);
        dispatch({
            type : SUBSCRIBE_DATA_FAIL
        });
    }
};

export const updateSubscription = ({payment_id,order_id}) => async dispatch=>{
    try{
        await axios.post("/api/subscribe/update",{payment_id,order_id});
    }catch(err){
        console.log(err);
    }
};