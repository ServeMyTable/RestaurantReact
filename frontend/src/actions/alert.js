import {v4 as uuid} from 'uuid';
import { SET_ALERT , REMOVE_ALERT } from './types';

import axios from 'axios';
import { removeLoading } from "./loading";

export const setAlert = (msg, alertType) => dispatch => {
    
    const id = uuid();
    dispatch({
        type : SET_ALERT,
        payload : { msg, alertType, id }
    });

    setTimeout(()=>
        dispatch({
            type : REMOVE_ALERT,
            payload : id
        })
    ,5000);
}

export const sendMessage = ({message,subject}) => async dispatch =>{
    try{
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({
            message : message,
            subject : subject
        });
        await axios.post("/api/help/send",body,config);
        dispatch(setAlert("Thanks for contacting us.","success"));
        dispatch(removeLoading());

    }catch(err){
        console.error(err);
        dispatch(setAlert("Some error occurred.","error"));
        dispatch(removeLoading());
    }
};