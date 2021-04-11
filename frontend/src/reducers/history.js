import { HISTORY_SUCCESS, HISTORY_FAIL } from '../actions/types';

const initialState = [];

function history(state = initialState, action){
    const {type,payload} = action;

    switch (type) {

        case HISTORY_SUCCESS:
            return payload;

        case HISTORY_FAIL:
            return state;
            
        default:
            return state;
    }
}

export default history;