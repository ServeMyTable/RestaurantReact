import { SET_ACCOUNT, FAILED_ACCOUNT } from '../actions/types';

const initialState=[];

function accounts(state=initialState,action){

    const { type, payload } = action;

    switch (type) {

        case SET_ACCOUNT:
            return payload
        
        case FAILED_ACCOUNT:
        default:
            return state;
    }
}

export default accounts;