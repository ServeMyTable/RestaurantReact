import { SET_MENUTYPE } from '../actions/types';

const initialState = 'Dashboard';

function menu(state = initialState, action){

    const {type,payload} = action;
    switch(type){
        case SET_MENUTYPE:
            return payload
        default:
            return state
    }
}

export default menu;