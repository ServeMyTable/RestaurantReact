import {
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAIL,
    UPDATE_EMPLOYEE_SUCCESS,
    UPDATE_EMPLOYEE_FAIL,
    DELETE_EMPLOYEE_SUCCESS,
    DELETE_EMPLOYEE_FAIL,
    SET_EMPLOYEE_SUCCESS,
    SET_EMPLOYEE_FAIL
} from '../actions/types';

const initialState = [];

function employees(state=initialState,action){

    const {type,payload} = action;

    switch (type) {

        case UPDATE_EMPLOYEE_SUCCESS:
        case ADD_EMPLOYEE_SUCCESS:
            return payload
        
        case DELETE_EMPLOYEE_SUCCESS:
        case SET_EMPLOYEE_SUCCESS:
            return payload
            
        case SET_EMPLOYEE_FAIL:
        case DELETE_EMPLOYEE_FAIL:
        case UPDATE_EMPLOYEE_FAIL:
        case ADD_EMPLOYEE_FAIL:
        default:
            return state;
    }

}

export default employees;