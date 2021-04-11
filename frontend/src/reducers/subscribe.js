import {
    SUBSCRIBE_DATA_PASS,
    SUBSCRIBE_DATA_FAIL,
    EMPTY_SUBSCRIPTION
} from '../actions/types';

const initialState = {};

function subscribe(state = initialState, action){

    switch (action.type) {

        case SUBSCRIBE_DATA_PASS:
            return action.payload;
        
        case EMPTY_SUBSCRIPTION:
            return {};

        case SUBSCRIBE_DATA_FAIL:    
        default:
            return state;
    }
};

export default subscribe;