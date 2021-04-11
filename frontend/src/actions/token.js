import { ADD_TOKEN, REMOVE_TOKEN, SET_TOKEN } from "./types";
import { setAlert } from './alert';
import axios from 'axios';
import { removeLoading } from "./loading";

export const getTokens = () => async dispatch =>{

    try {
        
        const Tokens = await axios.get('/api/token');
        dispatch({
            type : SET_TOKEN,
            payload : Tokens.data
        });
        
    } catch (error) {
        console.log(error);
    }
};

export const addToken = ({CustomerName,NoOfPersons}) => async dispatch =>{

    try {
        
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({CustomerName,NoOfPersons});

        await axios.post('/api/token',body,config);
        dispatch({type : ADD_TOKEN});
        //dispatch(getTokens());
        dispatch(removeLoading());
        dispatch(setAlert('Token added successfully','success'));

    } catch (error) {
        dispatch(removeLoading());
        dispatch(setAlert('Unable to add tokens','error'));
    }

};

export const removeToken = ({CName,NOP,tokenNo}) => async dispatch =>{
    
    try {
        
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({CName,NOP,tokenNo});
        await axios.post('/api/token/remove',body,config);
        dispatch({type : REMOVE_TOKEN});
        //dispatch(getTokens());
        dispatch(removeLoading());
        dispatch(setAlert('Token removed successfully','success'));

    } catch (error) {
        //dispatch(setAlert('Unable to remove tokens','error'));
        console.log(error);
    }

};

export const changeStatus = ({tokenNo}) => async dispatch =>{
    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({tokenNo});
        await axios.post('/api/token/changeStatus',body,config);
        dispatch(removeLoading());
        dispatch(setAlert('Called the customer successfully','success'));

    } catch (error) {
        dispatch(removeLoading());
        dispatch(setAlert('Unable to change status','error'));
    }
};
