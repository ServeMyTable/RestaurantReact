import { 
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, 
    UPDATE_FAIL,
    UPDATE_SUCCESS,
    EMPTY_SUBSCRIPTION
} from './types';

import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import { removeLoading } from './loading';

//Load User
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = axios.get('/api/auth');
        const data = (await res).data;
        dispatch({
            type : USER_LOADED,
            payload : data
        });

    } catch (err) {
        dispatch({
            type : AUTH_ERROR
        });
    }
}

//Register User
export const register = ({ username, email, password, Phone, Plan}) => async dispatch => {

    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({username,email,password,Phone,Plan});
    try {
        
        const res = await axios.post('/api/users',body,config);
        
        dispatch({
            type : REGISTER_SUCCESS,
            payload : res.data
        });
        dispatch(removeLoading());

        dispatch(loadUser());

    } catch (err) {

        dispatch(removeLoading());
        if(err.response){
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error=> dispatch(setAlert(error.msg,'error')));
            }
        }else{
            dispatch(setAlert("Server Error","error"));
        }
        dispatch({
            type : REGISTER_FAIL,
        });
        
    }

}

//Login User
export const login = (email , password) => async dispatch => {

    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({email,password});

    try {
        
        const res = await axios.post('/api/auth',body,config);

        dispatch({
            type : LOGIN_SUCCESS,
            payload : res.data
        });

        dispatch(loadUser());
        dispatch(removeLoading());

    } catch (err) {
        if(err.response){
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error=> dispatch(setAlert(error.msg,'error')));
            }
        }
        dispatch({
            type : LOGIN_FAIL,
        });
        dispatch(removeLoading());
    }

}

//Logout User
export const logout = () => dispatch => {
    dispatch({ type: EMPTY_SUBSCRIPTION });
    dispatch({ type : LOGOUT });
};

//Update User
export const basicUpdate = ({RestaurantName,Location,nTables,Phone}) => async dispatch => {
    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({RestaurantName,Location,nTables,Phone});
        const res = await axios.post('/api/profile',body,config);
        dispatch({
            type : UPDATE_SUCCESS,
            payload : res.data
        });
        dispatch(loadUser());

    } catch (err) {
        if(err.response){
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error=> dispatch(setAlert(error.msg,'error')));
            }
        }
        dispatch({
            type : UPDATE_FAIL,
        });
    }
};

export const updateName = ({RestaurantName})=>async dispatch=>{
    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({RestaurantName});
        const res = await axios.post('/api/profile/name',body,config);
        dispatch({
            type : UPDATE_SUCCESS,
            payload : res.data
        });
        dispatch(loadUser());
    } catch (err) {
        if(err.response){
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error=> dispatch(setAlert(error.msg,'error')));
            }
        }
        dispatch({
            type : UPDATE_FAIL,
        });
    }
};

export const updateLocation = ({Location})=>async dispatch=>{
    try {

        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({Location});
        const res = await axios.post('/api/profile/location',body,config);
        dispatch({
            type : UPDATE_SUCCESS,
            payload : res.data
        });
        dispatch(loadUser());
        
    } catch (err) {

        dispatch({
            type : UPDATE_FAIL,
        });
    }
};

export const updateTable = ({nTables})=>async dispatch=>{
    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({nTables});
        const res = await axios.post('/api/profile/table',body,config);
        dispatch({
            type : UPDATE_SUCCESS,
            payload : res.data
        });
        dispatch(loadUser());
    } catch (err) {

        if(err.response){
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error=> dispatch(setAlert(error.msg,'error')));
            }
        }
        dispatch({
            type : UPDATE_FAIL,
        });
    }
};

export const updateUPI = ({upiID})=>async dispatch=>{

    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        };
        const body = JSON.stringify({upiID});
        const res = await axios.post('/api/profile/upi',body,config);
        dispatch({
            type : UPDATE_SUCCESS,
            payload : res.data
        });
        dispatch(loadUser());

    } catch (err) {
        dispatch({
            type : UPDATE_FAIL,
        });
        dispatch(setAlert("Unable to add upi id","error"));
    }
};

export const addTax = ({Name, Type, Amount})=>async dispatch=>{

    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({Name, Type, Amount});
        const res = await axios.post('/api/users/addTax',body,config);
        if(res.data === "ok"){
            dispatch(setAlert("Tax added succesfully","success"));
            dispatch(loadUser());
        }else{
            dispatch(setAlert("Unable to add tax","error"));
        }

    } catch (err) {

        dispatch(setAlert("Unable to add tax","error"));
    }
};

export const removeTax = ({Name, Type, Amount})=>async dispatch=>{

    try {
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({Name, Type, Amount});
        const res = await axios.post('/api/users/removeTax',body,config);
        if(res.data === "ok"){
            dispatch(setAlert("Tax removed succesfully","success"));
            dispatch(loadUser());
        }else{
            dispatch(setAlert("Unable to delete tax","error"));
        }

    } catch (err) {

        dispatch(setAlert("Unable to delete tax","error"));
    }
};