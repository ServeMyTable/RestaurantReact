import {
    DISH_SUCCESS,
    DISH_FAIL, 
    REMOVE_DISH,
    UPDATE_DISH
} from '../actions/types';

const initialState = false;

function dish(state = initialState, action){
    const {type,payload} = action;
    switch (type) {

        case DISH_SUCCESS:
        case REMOVE_DISH:
        case UPDATE_DISH:
            return payload;
            
        case DISH_FAIL:
            return state;

        default:
            return state;
    }
}

export default dish;