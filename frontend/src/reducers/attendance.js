import {SET_ATTENDANCE} from '../actions/types';

const initialState = null;

function attendance(state=initialState,action) {

    const { type, payload } = action;
    switch (type) {

        case SET_ATTENDANCE:
            return payload;
    
        default:
            return state;
    }
}

export default attendance;