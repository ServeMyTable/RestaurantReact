import { ADD_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '../actions/types';

const initialState = [];

function token(state = initialState, action){
    switch (action.type) {
        
        case SET_TOKEN:
            return action.payload;

        case REMOVE_TOKEN:
        case ADD_TOKEN:    
        default:
            return state;
    }
};

export default token;