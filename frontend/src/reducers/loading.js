import {
    SET_LOADING_TRUE,
    SET_LOADING_FALSE
} from '../actions/types';

const initialState = false;

export default function loading(state=initialState,action){

    const {type,payload} = action;
    switch(type){

        case SET_LOADING_FALSE:
        case SET_LOADING_TRUE:
            return payload
        
        default:
            return state
    }
}