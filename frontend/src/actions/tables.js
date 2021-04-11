import {
    TABLE_SUCCESS, 
    TABLE_FAIL,
    ORDER_SUCCESS,
    ORDER_FAIL,
    CANCEL_SUCCESS,
    CANCEL_FAIL,

} from './types';
import { setAlert } from './alert';
import axios from 'axios';

export const getOrders = () => async dispatch =>{

    try {
        
        const Tables = await axios.get('/api/table');
        dispatch({
            type : TABLE_SUCCESS,
            payload : Tables.data
        });

    } catch (err) {
        dispatch({
            type : TABLE_FAIL
        });
    }
};

export const OrderComplete = ({TableNo,RestaurantId,OrderId}) => async dispatch =>{

    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({TableNo,RestaurantId,OrderId});
        await axios.post('/api/table/complete',body,config);

        dispatch({
            type : ORDER_SUCCESS
        });

        dispatch(getOrders());

    } catch (err) {
        dispatch({
            type : ORDER_FAIL
        });
    }

};

export const OrderCancel = ({TableNo,RestaurantId,OrderId}) => async dispatch =>{

    try {
        
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({TableNo,RestaurantId,OrderId});
        await axios.post('/api/table/cancel',body,config);

        dispatch({
            type : CANCEL_SUCCESS
        });

        dispatch(getOrders());

    } catch (err) {
        dispatch({
            type : CANCEL_FAIL
        });
    }
};

export const placeOrder = ({Dish,TableNo,TotalBill,SubTotal,CustomerName}) => async dispatch => {
    try{
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }

        const body = JSON.stringify({Dish,TableNo,TotalBill,SubTotal,CustomerName});
        await axios.post("/api/table/placeorder",body,config);
        
        dispatch(setAlert("Order Placed Successfully","success"));
       
        dispatch(getOrders());

    }catch(err){
        
        dispatch(setAlert("Error occurred","error"));
    }
};