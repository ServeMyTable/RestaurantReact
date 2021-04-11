import axios from 'axios';

import { HISTORY_SUCCESS, HISTORY_FAIL } from './types';

export const getOrders = () => async dispatch =>{
    try {
        
        const response = await axios.get('/api/history/');
        dispatch({
            type : HISTORY_SUCCESS,
            payload : response.data
        });

    } catch (err) {
        dispatch({
            type : HISTORY_FAIL
        });
    }
}