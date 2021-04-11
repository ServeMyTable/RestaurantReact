import { SET_ACCOUNT, FAILED_ACCOUNT } from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const setAccount = ({amountType,particulars,debit,credit}) => async dispatch => {

    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({amountType,particulars,debit,credit});

    try {

        const response = await axios.post('/api/accounts/',body,config);
        dispatch({
            type : SET_ACCOUNT,
            payload : response.data
        });
        dispatch(setAlert("Added Details to Accounts Successfully","success"));

    } catch (error) {
        dispatch({
            type : FAILED_ACCOUNT,
        });
        dispatch(setAlert("Error Occurred","error"));
        
    }

};

export const getAccounts = () => async dispatch => {
    
    try{
        
        const response = await axios.get('/api/accounts/');
        dispatch({
            type : SET_ACCOUNT,
            payload : response.data
        });
        
    }catch(err){
        dispatch({
            type : FAILED_ACCOUNT,
        }); 
    }

};
