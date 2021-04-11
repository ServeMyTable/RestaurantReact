import {
    TABLE_SUCCESS, 
    TABLE_FAIL,
    ORDER_SUCCESS,
    ORDER_FAIL,
    CANCEL_SUCCESS,
    CANCEL_FAIL,
} from '../actions/types';

const initialState = [];

function tables(state=initialState,action){

    const {type,payload} = action;
    switch(type){

        case TABLE_SUCCESS:
            return payload

        
        case ORDER_SUCCESS:
        case CANCEL_SUCCESS:
            return;

        case CANCEL_FAIL:
        case ORDER_FAIL:
        case TABLE_FAIL:
        default:
            return state
    }
    
}

export default tables;